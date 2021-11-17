import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'
import Slider from 'rc-slider/lib/Slider'
import 'rc-slider/assets/index.css'
import styles from './OpacityTool.module.scss'

const OpacityTool = props => {
  return (
    <div style={{height: '110px'}} className={styles.tool}>
      <Header as='h4'>
        Background Opacity
      </Header>
      <Slider min={10} max={100} defaultValue={props.value} value={props.value} onChange={props.onChange} />
      <div className={styles.displayValue}>{props.value}</div>
    </div>
  )
}

OpacityTool.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default OpacityTool
