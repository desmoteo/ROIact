import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import CursorIcon from '../../Assets/img/cursor-icon.svg'
import PolygonIcon from '../../Assets/img/polygon-icon.svg'
import RectangleIcon from '../../Assets/img/rectangle-icon.svg'
import InboundIcon from '../../Assets/img/inbound-icon.svg'
import OutboundIcon from '../../Assets/img/outbound-icon.svg'
import { Header, Image, Popup, Icon } from 'semantic-ui-react'
import styles from './DrawTools.module.scss'
import DrawHelpModal from '../DrawHelpModal'


const DrawTools = props => {
  const isDrawing = useSelector(state => state.canvas.drawing)
  const handleToolSelect = useCallback(
    tool => () => (isDrawing ? null : props.onToolSelect(tool)),
    [isDrawing]
  )
  const handleModeSelect = useCallback(
    mode => () => isDrawing ? null : props.onModeSelect(mode),
    [isDrawing]
  )
  const drawToolStyle = tool =>
    (props.selectedTool === tool ? styles.drawToolSelected : styles.drawTool) +
    (isDrawing ? ' ' + styles.disabled : '')
  const drawModeStyle = mode =>
    props.selectedMode === mode ? styles.drawToolSelected : styles.drawTool

  const [helpModalIsOpen, setHelpModalIsOpen] = useState(false)
  const openHelpModal = useCallback(() => setHelpModalIsOpen(true), [])
  const closeHelpModal = useCallback(() => setHelpModalIsOpen(false), [])

  return (
    <div>
      <div  className={styles.tool}>
        <div className={styles.mainrow}>
          <div className={styles.col}>
            <Header as='h4'>
              Draw
              <Popup
                inverted
                content='Instructions'
                trigger={
                  <Icon
                    className={styles.helpIcon}
                    inverted
                    circular
                    name='help'
                    style={{ margin: 0 }}
                    link
                    onClick={openHelpModal}
                  />
                }
              />
            </Header>
            <div className={styles.row}>
              <div
                className={drawToolStyle(null)}
                onClick={handleToolSelect(null)}
              >
                <Popup
                  inverted
                  content='Select'
                  trigger={
                    <Image
                      src={CursorIcon}
                      className={`${styles.drawIcon} ${styles.pointerIcon}`}
                    />
                  }
                />
              </div>
              <div
                className={drawToolStyle('rect')}
                onClick={handleToolSelect('rect')}
              >
                <Popup
                  inverted
                  content='Rectangle'
                  trigger={
                    <Image src={RectangleIcon} className={styles.drawIcon} />
                  }
                />
              </div>
              <div
                className={drawToolStyle('polygon')}
                onClick={handleToolSelect('polygon')}
              >
                <Popup
                  inverted
                  content='Polygon'
                  trigger={
                    <Image src={PolygonIcon} className={styles.drawIcon} />
                  }
                />
              </div>
            </div>
          </div>

        </div>

      </div>
      <div >
        {helpModalIsOpen && <DrawHelpModal onClose={closeHelpModal} />}
      </div>

    </div>
  )
}

DrawTools.propTypes = {
  onToolSelect: PropTypes.func.isRequired,
  selectedTool: PropTypes.string,
  onModeSelect: PropTypes.func.isRequired,
  selectedMode: PropTypes.string
}

export default DrawTools
