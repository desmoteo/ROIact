import { combineReducers } from 'redux'
import { actionCreator } from './Utils'
import { reducer as startupReducer } from './Startup'

import { reducer as canvasReducer } from './Canvas'


// reset type
export const RESET = 'RESET'
// reset action
export const resetStore = actionCreator(RESET)

export default (history) => combineReducers({
  startup: startupReducer,
  canvas: canvasReducer,
})
