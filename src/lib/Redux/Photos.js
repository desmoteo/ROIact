import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'
import { RESET } from './Root'

// Types
export const PHOTO_REQUEST = 'PHOTO_REQUEST'
export const PHOTO_SUCCESS = 'PHOTO_SUCCESS'
export const PHOTO_FAILURE = 'PHOTO_FAILURE'

// Actions
export default {
  // login
  photoRequest: actionCreator(PHOTO_REQUEST),
  photoSuccess: actionCreator(PHOTO_SUCCESS),
  photoFailure: actionCreator(PHOTO_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: {}
}

// Reducers
const request = state => Object.assign({}, state, { ...requestBlueprint })

// login
export const photoSuccess = (state, { stationId, data }) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: { ...state.data, [stationId]: data }
  })
}

const photoFailure = (state, { code, message }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    isAuthenticated: false,
    error: true,
    errorCode: code,
    errorMessage: message
  })
}

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case PHOTO_REQUEST:
      return request(state)
    case PHOTO_SUCCESS:
      return photoSuccess(state, payload)
    case PHOTO_FAILURE:
      return photoFailure(state, payload)
    case RESET:
      return INITIAL_STATE
    default:
      return state
  }
}
