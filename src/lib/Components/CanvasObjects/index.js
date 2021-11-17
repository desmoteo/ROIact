import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Header, List, Icon } from 'semantic-ui-react'
import ShapeModal from '../ShapeModal'
import CanvasActions from '../../Redux/Canvas'
import EventDispatcher from '../../Services/EventDispatcher'
import styles from './CanvasObjects.module.scss'

const CanvasObjects = props => {
  const dispatch = useDispatch()
  const objects = useSelector(state => state.canvas.shapes)
  const [selectedObjects, setSelectedObjects] = useState([])
  const [editingObject, setEditingObject] = useState(null)
  const isDrawing = useSelector(state => state.canvas.drawing)


  const handleShapeSelection = useCallback((evtName, ids, from) => {
    if (from !== 'list') {
      setSelectedObjects(ids)
    }
  })

  const removeShape = useCallback(
    id => () => {
      EventDispatcher.emit('shapeRemoved', id)
      dispatch(CanvasActions.removeShape(id))
    },
    []
  )

  const selectShape = useCallback(
    ids => () => {
      setSelectedObjects(ids)
      EventDispatcher.emit('shapeSelected', ids, 'list')
    },
    []
  )

  const editShape = useCallback(
    obj => () => {
      setEditingObject(obj)
    },
    []
  )

  useEffect(() => {
    // shape selected directly on canvas -> dispatched event
    EventDispatcher.register('shapeSelected', handleShapeSelection)

    return () => {
      EventDispatcher.unregister('shapeSelected', handleShapeSelection)
    }
  }, [])

  return (
    <div className={styles.objectslist}>
      <Header as='h4'>Regions of Interest (ROIs)</Header>
      <List>
        {objects.map((obj, index) => {
          return (
            <List.Item
              key={obj.name}
              className={`${styles.listitem} ${selectedObjects && [...selectedObjects].indexOf(obj.id) !== -1
                  ? styles.selected
                  : ''
                }`}
            >
              <List.Content floated='right'>
                <Icon name='edit' link onClick={editShape(obj)} disabled={isDrawing} color='blue' />
                <Icon name='trash' link onClick={removeShape(obj.id)} disabled={isDrawing} color='blue' />
              </List.Content>
              <List.Content>
                <List.Header as='span' onClick={selectShape([obj.id])}>
                  {obj.name}
                </List.Header>
              </List.Content>
            </List.Item>
          )
        })}
      </List>
      {editingObject && (
        <ShapeModal
          shape={editingObject}
          onClose={() => setEditingObject(null)}
          onSave={(id, name, mode, threshold) => {
            dispatch(CanvasActions.editShapeMeta({ id, meta: { name, mode, threshold } }))

          }}
        />
      )}
    </div>
  )
}

CanvasObjects.propTypes = {}

export default CanvasObjects
