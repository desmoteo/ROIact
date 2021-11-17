import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import OpacityTool from '../OpacityTool'
import DrawTools from '../DrawTools'
import CanvasActions from '../../Redux/Canvas'
import 'rc-slider/assets/index.css'
import styles from './Toolbox.module.scss'
import SaveCanvasButton from '../SaveCanvasButton/'


const Toolbox = props => {
  const dispatch = useDispatch()
  const opacity = useSelector(state => state.canvas.tools.opacity)
  const setOpacity = useCallback(value => dispatch(CanvasActions.setBgOpacity(value)), [])
  const selectedTool = useSelector(state => state.canvas.tools.selected)
  const setSelectedTool = useCallback(value => dispatch(CanvasActions.setSelectedTool(value)), [])
  const selectedMode = useSelector(state => state.canvas.tools.mode)
  const setSelectedMode = useCallback(value => dispatch(CanvasActions.setSelectedMode(value)), [])

  return (
    <div style={{ 'text-align': '-webkit-center' }}>
      <DrawTools style={{height: '110px'}}
                onToolSelect={setSelectedTool}
                selectedTool={selectedTool}
                selectedMode={selectedMode}
                onModeSelect={setSelectedMode}
              />
    </div>

  )
}

Toolbox.propTypes = {
}

export default Toolbox
