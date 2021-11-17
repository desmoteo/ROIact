import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import CanvasActions from '../../Redux/Canvas'
import { Button, Icon } from 'semantic-ui-react'
import { request } from '../../Services/Request'
import { toast } from 'react-toastify'

import styles from './SaveCanvasButton.module.scss'

const SaveCanvasButton = props => {
  const dispatch = useDispatch()
  const isSaving = useSelector(state => state.canvas.saving)
  const isDirty = useSelector(state => state.canvas.dirty)
  const shapes = useSelector(state => state.canvas.shapes)

  const save = useCallback(() => {
    dispatch(CanvasActions.setSaving(true))
    props.save_callback(shapes)
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
  }, [props.stationId, shapes])

  return (
    <div className={styles.wrapper}>
      <Button loading={isSaving} primary disabled={!isDirty} onClick={save} fluid>
        <Icon name='save' /> Save
      </Button>
    </div>
  )
}

SaveCanvasButton.propTypes = {
  save_callback: PropTypes.func.isRequired
}

export default SaveCanvasButton
