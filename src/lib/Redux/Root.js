import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { actionCreator } from './Utils'
import { reducer as startupReducer } from './Startup'

import { reducer as uiReducer } from './Ui'
import { reducer as canvasReducer } from './Canvas'

import { reducer as photosReducer } from './Photos'

// reset type
export const RESET = 'RESET'
// reset action
export const resetStore = actionCreator(RESET)

export default (history) => combineReducers({
  router: connectRouter(history),
  startup: startupReducer,
  ui: uiReducer,
  canvas: canvasReducer,
  photos: photosReducer,
})
