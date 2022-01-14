import React from 'react';
import ROIEditor from "./Components/Body.js"

import { Provider } from 'react-redux'

import store from './Redux/Store'


const ROIEditorWithProvider = props => {

  return (
    <Provider store={store}>
      <ROIEditor help={props.help} loading={props.loading} photo={props.photo} shapes={props.shapes} save_callback={props.save_callback} />
    </Provider>
  )
}

export { ROIEditor, ROIEditorWithProvider };
