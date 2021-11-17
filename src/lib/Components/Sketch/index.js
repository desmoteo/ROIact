import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'semantic-ui-react'
import styles from './Sketch.module.scss'
import { withSize } from 'react-sizeme'
import CanvasActions from '../../Redux/Canvas'
import EventDispatcher from '../../Services/EventDispatcher'
import 'fabric' //} from "../../node_modules/fabric/dist/fabric.js";
import Canvas from './Canvas'



// OK, this is local state, something like instance properties for a class
// component but for a pure functional component. It's useful because I want this state
// to persist among new renders, and I don't want to use the react state because I want
// the changes to be applied immediately. I'll take care of resetting it if needed.
// Also this component is a pure logical component, and full of listeners callbacks.
// Such functions, when registered, won't receive updates for the redux props that change,
// so I'll use this object reference inside them, and I'll update this object properties
// when a redux prop I need inside those functions changes.
const initLocalState = () => {
  return {
    canvas: null,
    canvasSize: null,
    ignoreSelectionCreated: false
  }
}
const s = initLocalState()

/**
 * The sketch component, the mind behind the drawing feature
 * EventDispatcher is used to communicate ina sync way between
 * different components
 */
const Sketch = props => {
  // redux store stuff

  const dispatch = useDispatch()
  const tools = useSelector(state => state.canvas.tools)
  const shapes = useSelector(state => state.canvas.shapes)
  if (s.canvas) {
    s.canvas.setStoreShapes(shapes)
    s.canvas.setShapeMode(tools.mode)
    s.canvas.setShapeThreshold(50)
  }

  const save = useCallback((evtName, mshapes) => {
    dispatch(CanvasActions.setSaving(true))
    props.save_callback(mshapes)
    /*request(
      'saveNoTrespassingZones',
      [shapes],
      'Si è verificato un errore nel salvare le no trespassing zones: {error}',
      response => {
        dispatch(CanvasActions.setSaving(false))
        dispatch(CanvasActions.setDirty(false))
        toast(
          'Salvataggio effettuato con successo',
          { type: 'success' }
        )
      },
      error => { // eslint-disable-line
        dispatch(CanvasActions.setSaving(false))
      }
    )*/
    dispatch(CanvasActions.setSaving(false))
  }, [])

  // listeners callbacks

  // shape removal: notified by the objects list
  const handleShapeRemoval = useCallback((evtName, id) => s.canvas.removeShape(id), [])
  // shape selection: notified by the objects list
  const handleShapeSelection = useCallback((evtName, ids, from) => {
    if (from !== 'canvas') {
      // also from the canvas we trigger this event and we don't need to process it
      // avoid ping pong between this component and objects component
      s.ignoreSelectionCreated = true
      s.canvas.setActiveSelection(ids[0])
    }
  })
  // shape selection: notify the objects list
  const handleSelectionCreation = useCallback(e => {
    if (!s.ignoreSelectionCreated) {
      EventDispatcher.emit(
        'shapeSelected',
        e.selected.map(st => {st.lockScalingFlip = true;  st.lockRotation = true; st.lockMovementX = true; st.lockMovementY = true; st.lockScalingX = true; st.lockScalingY = true; return st.id }),
        'canvas'
      )
    }
    s.ignoreSelectionCreated = false
  }, [])

  // shape selection updated: notify the objects list
  const handleSelectionUpdate = useCallback(e => {
    if (!s.ignoreSelectionCreated) {
      e.target.lockScalingFlip = true;  
      e.target.lockRotation = true; 
      e.target.lockMovementX = true; 
      e.target.lockMovementY = true; 
      e.target.lockScalingX = true; 
      e.target.lockScalingY = true;
      EventDispatcher.emit('shapeSelected', [e.target.id], 'canvas')
    }
    s.ignoreSelectionCreated = false
  }, [])

  // shape selection cleared: notify the objects list
  const handleSelectionClear = useCallback(e => {
    EventDispatcher.emit('shapeSelected', null, 'canvas')
  }, [])

  // shape edit -> save to redux store
  const handleShapeEdit = useCallback(e => {
    dispatch(
      CanvasActions.editShape({
        id: e.target.id,
        shape: s.canvas.fabric2redux(e.target)
      }),
    )

  }, [])

  const handleShapeRemove = useCallback(
    id => {
      dispatch(CanvasActions.removeShape(id))
    },
    []
  )

  // DID MOUNT
  useEffect(() => {
    console.info('SKETCH', 'mounting')
    s.canvas = new Canvas('canvas', {
      opacity: tools.opacity,
      onShapeRemove: handleShapeRemove,
      setDrawing: isDrawing => dispatch(CanvasActions.setDrawing(isDrawing))
    })
    s.canvas.setStoreShapes(shapes)
    addListeners() // register all listeners

    // when unmounting
    return () => {
      console.info('SKETCH', 'unmounting')
      s.canvas.deinitialize()
      removeListeners() // clear all listeners
    }
  }, [])

  // fetch shapes
  useEffect(() => {
    s.canvas.setStoreShapes(shapes)
    s.canvas.redraw()
  }, [shapes])

  // resize
  useEffect(() => {
    s.canvas.resize(props.size)
  }, [props.size.width, props.size.height])

  // update opacity
  useEffect(() => {
    s.canvas.setOpacity(tools.opacity)
  }, [tools.opacity])

  // on selected tool change
  useEffect(() => {
    if (tools.selected) {
      s.canvas.disableSelection()
      // add mouse events (and remove prev)
      s.canvas.removeMouseListeners()
      s.canvas.addMouseListeners(mousedown, mousemove)
    } else {
      s.canvas.enableSelection()
      s.canvas.removeMouseListeners()
    }
  }, [tools.selected])

  const addListeners = () => {
    console.info('registering listeners')
    // Tools dispatches
    // I prefer to use a custom dispatcher to trigger events which seems more like
    // native events than redux actions. I don't like to manage every syncronization
    // with useEffect or componentDidMount because we always have to compare prev props
    // with new props.
    EventDispatcher.register('save', save)
    EventDispatcher.register('shapeRemoved', handleShapeRemoval)
    EventDispatcher.register('shapeSelected', handleShapeSelection)
    EventDispatcher.register('redraw', () => {
      s.canvas.redraw.bind(s.canvas)
    })

    // obeserve canvas selection.
    s.canvas.addSelectionListeners(
      handleSelectionCreation,
      handleSelectionUpdate,
      handleSelectionClear
    )
    // shape modification
    s.canvas.addShapeUpdateListener(handleShapeEdit)
  }

  const removeListeners = () => {
    EventDispatcher.unregister('shapeRemoved', handleShapeRemoval)
    EventDispatcher.unregister('shapeSelected', handleShapeSelection)
    EventDispatcher.unregister('redraw', s.canvas.redraw)
    s.canvas.removeSelectionListeners()
    s.canvas.removeShapeUpdateListener()
  }

  const mousedown = e => {
    if ((s.canvas.getActiveSelection() && !s.canvas.drawing) || !tools.selected) {
      return false
    }
    dispatch(CanvasActions.setDrawing(true))
    s.canvas.drawShape(
      tools.selected,
      'mousedown',
      e,
      handleDrawEnd
    )
  }

  const mousemove = e => {
    if ((s.canvas.getActiveSelection() && !s.canvas.isDrawing) || !tools.selected) {
      return false
    }
    s.canvas.drawShape(tools.selected, 'mousemove', e, handleDrawEnd)
  }

  const handleDrawEnd = shape => {
    dispatch(
      CanvasActions.addShape({
        id: shape.id,
        name: shape.name,
        type: shape.type,
        mode: shape.mode,
        threshold: shape.threshold,
        data: s.canvas.fabric2redux(shape)
      }),

    )
    // notify the object list about selection
    EventDispatcher.emit('shapeSelected', [shape.id], 'canvas')

  }

  return (
    <div className={styles.canvasWrapper}>
      <Image style={{ position: 'absolute', width: '1080px', height: '607px' }}

        src={`${props.photo}`}
      />
      <canvas id='canvas' className={styles.canvas} />
    </div>
  )
}

Sketch.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  photo: PropTypes.string,
  shapes: PropTypes.string,
  save_callback: PropTypes.func
}

export default withSize({ monitorHeight: true })(Sketch)
