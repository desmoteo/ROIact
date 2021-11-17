import { actionCreator } from './Utils'

// Type
export const SET_GROWTH_RATE_REF = 'SET_GROWTH_RATE_REF'

// Actions
export default {
  setGrowthRateRef: actionCreator(SET_GROWTH_RATE_REF)
}

// Initial state
export const INITIAL_STATE = {
  growthRateRefs: {}
}

// Reducers
const setGrowthRateRef = (state, { stationId, ref }) =>
  Object.assign({}, state, {
    growthRateRefs: { ...state.growthRateRefs, [stationId]: ref }
  })

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SET_GROWTH_RATE_REF:
      return setGrowthRateRef(state, payload)
    default:
      return state
  }
}
