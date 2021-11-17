import React, { useState, useCallback } from 'react'
import Sketch from './Sketch/'
import Toolbox from './Toolbox/'
import { Segment, Divider, Message } from 'semantic-ui-react'

import CanvasObjects from './CanvasObjects/'

import { withLoader } from '../HOC/Loader'

const ROIEditor = (props) => {

    const [helpMessageIsOpen, setHelpMessageIsOpen] = useState(true)

    const closeHelpMessage = useCallback(() => setHelpMessageIsOpen(false), [])


    return (
        <Segment raised>
            <div >
                {helpMessageIsOpen && <Message info onDismiss={closeHelpMessage}>
                    <Message.Header>Setup {process.env.REACT_APP_NAME} by defining the Regions of Interest (ROIs)</Message.Header>
                    <Message.List>
                        <Message.Item>Use the drawing tools to draw rectangles and polygons for the ROIs.</Message.Item>
                        <Message.Item>Change ROI threshold and name by selecting the ROI in the list at the bottom of the page</Message.Item>
                    </Message.List>

                </Message>}

                <div style={{ width: "1480px", margin: '0 auto' }}>
                    <Segment raised style={{ position: "absolute", width: "150px", paddingRight: '1%' }}>
                        <Toolbox save_callback={props.save_callback}></Toolbox>
                    </Segment>
                    <div style={{ margin: "auto" }}>
                        <Segment raised style={{ margin: 'auto', display: 'table', width: '1080px' }}>
                            {withLoader(
                                <Sketch save_callback={props.save_callback} shapes={props.shapes} size={{ width: 1080, height: 607 }} photo={props.photo} />,
                                (props.loading || !props.photo)
                            )}
                        </Segment>
                    </div>
                </div>


                <div style={{ clear: 'both' }}></div>

                <Divider></Divider>
                <CanvasObjects />

            </div>

        </Segment>
    );

}


export default ROIEditor;
