import config from '../../Config'
import "fabric"// from "../../node_modules/fabric/dist/fabric.js";

class Canvas {
  /**
   * Constructs a Canvas instance, initializes fabric canvas
   */
  constructor (canvasId, { opacity, onShapeRemove, setDrawing }) {
    this.FCanvas = new window.fabric.Canvas(canvasId, {
      backgroundColor: `rgba(255, 255, 255, ${(100 - opacity) / 100})`
    })
    this.drawing = false
    this.drawingData = {}
    this.storeShapes = []
    this.shapeMode = null
    this.threshold = 50
    this.shapesCounter = 0
    this.polygonKeyListener = this.polygonKeyListener.bind(this)
    this.cancelKeyListener = this.cancelKeyListener.bind(this)
    this.onShapeRemove = onShapeRemove
    this.setDrawing = setDrawing

    window.fabric.util.addListener(window, 'keyup', this.cancelKeyListener)
  }

  cancelKeyListener (e) {
    if (e.keyCode === 46) {
      // cancel
      if (this.drawing) {
        this.drawingData = {}
        this.drawing = false
        this.redraw()
        this.setDrawing(false)
      } else {
        const shape = this.getActiveSelection()
        if (shape) {
          if (shape._objects) {
            shape._objects.forEach(s => {
              this.FCanvas.remove(s)
              this.onShapeRemove(s.id)
            })
          } else {
            this.FCanvas.remove(shape)
            this.onShapeRemove(shape.id)
          }
        }
      }
    }
  }

  deinitialize () {
    window.fabric.util.removeListener(window, 'keyup', this.cancelKeyListener)
  }

  /**
   * Updates the redux shapes, used to redraw everything in sync with
   * the store
   * @param shapes array of stored shapes
   */
  setStoreShapes (shapes) {
    this.storeShapes = [...shapes]
    this.shapesCounter = shapes.reduce(
      (acc, item) => Math.max(acc, item.id),
      0
    )
  }

  /**
   * Updates the redux shapes, used to redraw everything in sync with
   * the store
   * @param mode inboud|outbound
   */
  setShapeMode (mode) {
    this.shapeMode = mode
  }

  setShapeThreshold (t) {
    this.threshold = t
  }  

  /**
   * Sets the opacity of the canvas background
   * @param opacity
   */
  setOpacity (opacity) {
    this.FCanvas.setBackgroundColor(
      `rgba(255, 255, 255, ${(100 - opacity) / 100})`,
      this.FCanvas.renderAll.bind(this.FCanvas)
    )
  }

  resize (size) {
    if (size) {
      this.FCanvas.setWidth(size.width)
      this.FCanvas.setHeight(size.height)
      this.redraw()
    }
  }

  /**
   * Redraw the canvas
   * It removes all current shapes and redraws the stored ones
   */
  redraw () {
    if (this.storeShapes) {
      this.FCanvas.remove(...this.FCanvas.getObjects())
      this.storeShapes.forEach(shape =>
        this.FCanvas.add(
          this.shapeFromData(
            this.redux2fabric(
              {
                ...shape.data,
                id: shape.id,
                name: shape.name,
                type: shape.type,
                mode: shape.mode,
                threshold: shape.threshold
              },
              this.FCanvas.width,
              this.FCanvas.height
            )
          )
        )
      )
    }
  }

  /**
   * Provides the fabric object class given its configuration
   *
   * @param data shape configuration
   * @return fabric object instance
   */
  shapeFromData (data) {
    switch (data.type) {
      case 'rect':
        return new window.fabric.Rect({ ...data })
      case 'polygon':
        return new window.fabric.Polygon(data.get('points'), { ...data })
      default:
        return null
    }
  }

  /**
   * Number of shapes currently on canvas
   * @return number of shapes
   */
  shapesCount () {
    return this.FCanvas.getObjects().length
  }

  /**
   * Shapes on canvas
   * @return fabric shapes instances
   */
  shapes () {
    return this.FCanvas.getObjects()
  }

  /**
   * Enables selection on canvas
   */
  enableSelection () {
    this.FCanvas.selection = true
  }

  /**
   * Disables selection on canvas
   * It's better to disable selection while drawing, because
   * can mess up events
   */
  disableSelection () {
    this.FCanvas.selection = false
  }

  /**
   * Provides the active selection object
   * return selection
   */
  getActiveSelection () {
    return this.FCanvas.getActiveObject()
  }

  /**
   * Provides the active selection object
   * return selection
   */
  setActiveSelection (id) {
    this.FCanvas.setActiveObject(this.shapes().filter(obj => obj.id === id)[0])
    this.FCanvas.renderAll()
  }

  /**
   * Removes a shape from canvas given the id
   */
  removeShape (id) {
    this.FCanvas.remove(this.shapes().filter(obj => obj.id === id)[0])
  }

  /**
   * Draws a shape in the dirfferent phases:
   * - init (mousdown)
   * - draw (mousemove)
   * - end (mouseup)
   *
   * @param shapeType
   * @param eventType mousedown|mousemove
   * @param isDrawing
   * @param e the event object
   */
  drawShape (shapeType, eventType, e, handleDrawEnd) {
    let phase
    if (eventType === 'mousemove' && !this.drawing) return
    if (eventType === 'mousedown' && !this.drawing) {
      this.setDrawing(true)
      phase = 'init'
      this.drawing = true
    } else {
      phase = 'draw'
    }

    switch (shapeType) {
      case 'rect':
        return this[`${phase}Rectangle`](eventType, e, handleDrawEnd)
      case 'polygon':
        return this[`${phase}Polygon`](eventType, e, handleDrawEnd)
      default:
        break
    }
  }

  // mousedown
  initRectangle (eventType, e) {
    const mouse = this.FCanvas.getPointer(e.e)

    const shape = new window.fabric.Rect({
      width: 0,
      height: 0,
      left: mouse.x,
      top: mouse.y,
      fill: config.canvas[`${this.shapeMode}Fill`],
      stroke: config.canvas[`${this.shapeMode}Stroke`],
      strokeUniform: true,
      id: ++this.shapesCounter,
      type: 'rect',
      name: `rectangle_${this.shapesCounter}`,
      mode: this.shapeMode,
      threshold: this.threshold
    })

    this.drawingData.x = mouse.x
    this.drawingData.y = mouse.y
    this.drawingData.shape = shape

    this.FCanvas.add(shape)
  }

  // mousemove
  drawRectangle (eventType, e, handleDrawEnd) {
    if (eventType === 'mousedown') {
      return this.endRectangle(handleDrawEnd)
    }

    const mouse = this.FCanvas.getPointer(e.e)

    const w = Math.abs(mouse.x - this.drawingData.x)
    const h = Math.abs(mouse.y - this.drawingData.y)

    if (!w || !h) {
      return false
    }

    const left = Math.min(this.drawingData.x, mouse.x)
    const top = Math.min(this.drawingData.y, mouse.y)

    this.drawingData.shape
      .set('width', w)
      .set('height', h)
      .set('left', left)
      .set('top', top)

    this.FCanvas.renderAll()
  }

  endRectangle (handleDrawEnd) {
    this.setDrawing(false)
    const shape = this.drawingData.shape
    if (shape.width > 1 && shape.height > 1) {
      // we create a new copy of the shape because we're going
      // to clean the shape used during the mouse events
      const finalShape = this.shapeFromData(shape)
      this.FCanvas.remove(shape)
      this.FCanvas.add(finalShape)
      // set the shape as active
      this.FCanvas.setActiveObject(finalShape)
      this.drawing = false
      this.drawingData = {}
      handleDrawEnd(shape)
    } else {
      this.FCanvas.remove(shape)
      this.drawingData = {}
      --this.shapesCounter
      this.drawing = false
    }
  }

  polygonKeyListener (e) {
    if (e.keyCode === 27) {
      this.drawing = false
      this.endPolygon(this.drawingData.handleDrawEnd)
    }
  }

  // mousedown
  initPolygon (eventType, e, handleDrawEnd) {
    const mouse = this.FCanvas.getPointer(e.e)
    this.drawingData.handleDrawEnd = handleDrawEnd
    window.fabric.util.addListener(window, 'keyup', this.polygonKeyListener)

    const shape = new window.fabric.Polygon(
      [
        {
          x: mouse.x,
          y: mouse.y
        },
        {
          x: mouse.x + 10,
          y: mouse.y + 10
        }
      ],
      {
        fill: config.canvas[`${this.shapeMode}Fill`],
        stroke: config.canvas[`${this.shapeMode}Stroke`],
        strokeUniform: true,
        selectable: false,
        id: ++this.shapesCounter,
        type: 'polygon',
        name: `polygon_${this.shapesCounter}`,
        mode: this.shapeMode,
        threshold: this.threshold
      }
    )

    this.drawingData.x = mouse.x
    this.drawingData.y = mouse.y
    this.drawingData.shape = shape

    this.FCanvas.add(shape)
  }

  drawPolygon (eventType, e, handleDrawEnd) {
    const mouse = this.FCanvas.getPointer(e.e)

    const points = this.drawingData.shape.get('points')
    if (eventType === 'mousemove') {
      points.pop()
    } else {
    }
    points.push({
      x: mouse.x,
      y: mouse.y
    })

    const fill = this.drawingData.shape.get('fill')
    const stroke = this.drawingData.shape.get('stroke')
    const threshold = this.drawingData.shape.get('threshold')
    const id = this.drawingData.shape.get('id')
    const type = this.drawingData.shape.get('type')
    const name = this.drawingData.shape.get('name')
    const mode = this.drawingData.shape.get('mode')

    this.FCanvas.remove(this.drawingData.shape)
    this.drawingData.shape = new window.fabric.Polygon(points, {
      fill,
      stroke,
      id,
      type,
      name,
      mode,
      strokeUniform: true,
      selectable: false,
      threshold
    })
    this.FCanvas.add(this.drawingData.shape)
    this.FCanvas.renderAll()
  }

  endPolygon (handleDrawEnd) {
    window.fabric.util.removeListener(window, 'keyup', this.polygonKeyListener)
    this.setDrawing(false)
    const shape = this.drawingData.shape

    const fill = shape.get('fill')
    const id = shape.get('id')
    const type = shape.get('type')
    const name = shape.get('name')
    const mode = shape.get('mode')
    const threshold = shape.get('threshold')

    const points = shape.points
    // points.pop() // uncomment to remove last mousemove point
    if (points.length > 2) {
      const finalShape = this.shapeFromData(shape)
      finalShape.set('fill', fill)
      finalShape.set('id', id)
      finalShape.set('type', type)
      finalShape.set('name', name)
      finalShape.set('mode', mode)
      finalShape.set('threshold', threshold)
      finalShape.set('selectable', true)
      this.FCanvas.remove(shape)
      this.drawingData = {}
      this.FCanvas.add(finalShape)
      // set the shape as active
      this.FCanvas.setActiveObject(finalShape)
      this.drawing = false
      handleDrawEnd(shape)
    } else {
      this.FCanvas.remove(shape)
      this.drawingData = {}
      --this.shapesCounter
      this.drawing = false
    }
  }

  /**
   * Conversion function used to store a fabric shape
   * Fabric uses absolute (in px) positioning and measuring of a shape, i.e. a rectangle
   * is described by (top, left) position of the top left corner, width and height.
   * Also fabric uses two scale factors which act on width and height when the shape
   * is resized.
   * I can't store such measures in absolute px, we need to work in percentage in order
   * to be able to draw above every image size. Also I don't like to use the scaling factors,
   * so I'll re-calculate width and height and set them to 1
   *
   * @param shape the fabric object class
   * @param canvasWidth the canvas width
   * @param canvasHeight the canvas height
   * @return converted object
   *
   */
  fabric2redux (shape) {
    shape = shape.toJSON()

    const left = (shape.left * 100) / this.FCanvas.width
    const top = (shape.top * 100) / this.FCanvas.height

    const width = (shape.width * shape.scaleX * 100) / this.FCanvas.width
    const height = (shape.height * shape.scaleY * 100) / this.FCanvas.height

    if (shape.type === 'polygon') {
      shape.points = shape.points.map(p => ({
        x: (p.x * shape.scaleX * 100) / this.FCanvas.width,
        y: (p.y * shape.scaleY * 100) / this.FCanvas.height
      }))
    }

    return { ...shape, left, top, width, height, scaleX: 1, scaleY: 1 }
  }

  /**
   * Conversion function used create a fabric shape from the stored redux object
   *
   * @param shape the stored redux object
   * @param canvasWidth the canvas width
   * @param canvasHeight the canvas height
   * @return the fabric shape object instance
   *
   */
  redux2fabric (shape) {
    const left = Math.round((shape.left * this.FCanvas.width) / 100)
    const top = Math.round((shape.top * this.FCanvas.height) / 100)

    const width = Math.round((shape.width * this.FCanvas.width) / 100)
    const height = Math.round((shape.height * this.FCanvas.height) / 100)

    if (shape.type === 'rect') {
      return new window.fabric.Rect({
        ...shape,
        left,
        top,
        width,
        height
      })
    } else if (shape.type === 'polygon') {
      shape.points = shape.points.map(p => ({
        x: (p.x * this.FCanvas.width) / 100,
        y: (p.y * this.FCanvas.height) / 100
      }))
      return new window.fabric.Polygon(shape.points, {
        ...shape,
        left,
        top,
        width,
        height
      })
    }
  }

  // all listener controllers

  addMouseListeners (cbMousedown, cbMousemove, cbMouseup) {
    this.FCanvas.on('mouse:down', cbMousedown)
    this.FCanvas.on('mouse:move', cbMousemove)
  }

  removeMouseListeners () {
    this.FCanvas.off('mouse:down')
    this.FCanvas.off('mouse:move')
  }

  addSelectionListeners (cbCreated, cbUpdated, cbCleared) {
    this.FCanvas.on('selection:created', cbCreated)
    this.FCanvas.on('selection:updated', cbUpdated)
    this.FCanvas.on('selection:cleared', cbCleared)
  }

  removeSelectionListeners () {
    this.FCanvas.off('selection:created')
    this.FCanvas.off('selection:updated')
    this.FCanvas.off('selection:cleared')
  }

  addShapeUpdateListener (cb) {
    this.FCanvas.on('object:modified', cb)
  }

  removeShapeUpdateListener () {
    this.FCanvas.off('object:modified')
  }
}

export default Canvas
