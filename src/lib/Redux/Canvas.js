import config from '../Config'
import { actionCreator } from './Utils'
import EventDispatcher from '../Services/EventDispatcher'
import { RESET } from './Root'

// Type
export const INIT_SHAPES = 'INIT_SHAPES'
export const ADD_SHAPE = 'ADD_SHAPE'
export const EDIT_SHAPE = 'EDIT_SHAPE'
export const EDIT_SHAPE_META = 'EDIT_SHAPE_META'
export const REMOVE_SHAPE = 'REMOVE_SHAPE'
export const SET_SAVING = 'SET_SAVING'
export const SET_DIRTY = 'SET_DIRTY'
export const SET_DRAWING = 'SET_DRAWING'
export const SET_BG_OPACITY = 'SET_BG_OPACITY'
export const SET_SELECTED_TOOL = 'SET_SELECTED_TOOL'
export const SET_SELECTED_MODE = 'SET_SELECTED_MODE'
export const RESET_CANVAS = 'RESET_CANVAS'

// Actions
export default {
  setBgOpacity: actionCreator(SET_BG_OPACITY),
  setSelectedTool: actionCreator(SET_SELECTED_TOOL),
  setSelectedMode: actionCreator(SET_SELECTED_MODE),
  setSaving: actionCreator(SET_SAVING),
  setDirty: actionCreator(SET_DIRTY),
  setDrawing: actionCreator(SET_DRAWING),
  initShapes: actionCreator(INIT_SHAPES),
  addShape: actionCreator(ADD_SHAPE),
  editShape: actionCreator(EDIT_SHAPE),
  editShapeMeta: actionCreator(EDIT_SHAPE_META),
  removeShape: actionCreator(REMOVE_SHAPE),
  resetCanvas: actionCreator(RESET_CANVAS)
}

// Initial state
export const INITIAL_STATE = {
  tools: {
    opacity: 80,
    mode: 'inbound',
    selected: null
  },
  shapes: [],
  dirty: false,
  saving: false,
  drawing: false
}

// Reducers
const setSaving = (state, isSaving) =>
  Object.assign({}, state, {
    saving: isSaving
  })

const setDirty = (state, isDirty) =>
  Object.assign({}, state, {
    dirty: isDirty
  })

const setDrawing = (state, isDrawing) =>
  Object.assign({}, state, {
    drawing: isDrawing
  })

const setBgOpacity = (state, value) =>
  Object.assign({}, state, {
    tools: { ...state.tools, opacity: value }
  })

const setSelectedTool = (state, value) =>
  Object.assign({}, state, {
    tools: { ...state.tools, selected: value }
  })

const setSelectedMode = (state, mode) =>
  Object.assign({}, state, {
    tools: { ...state.tools, mode }
  })

const initShapes = (state, shapes) =>
  Object.assign({}, state, {
    shapes
  })

const addShape = (state, shape) => {
  const newState = Object.assign({}, state, {
    dirty: true,
    shapes: [...state.shapes, shape]
  })
  setTimeout(() => EventDispatcher.emit('save', newState['shapes']), 200)
  return newState
}


const editShape = (state, { id, shape }) => {
  const newState = Object.assign({}, state, {
    dirty: true,
    shapes: state.shapes.map(s =>
      s.id === id ? { ...s, data: shape } : s
    )
  })
  setTimeout(() => EventDispatcher.emit('save', newState['shapes']), 200)
  return newState
}


const editShapeMeta = (state, { id, meta }) => {
  setTimeout(() => EventDispatcher.emit('redraw'), 100)

  const newState = Object.assign({}, state, {
    dirty: true,
    shapes: state.shapes.map(s =>
      s.id === id
        ? {
          ...s,
          ...meta,
          data: {
            ...s.data,
            stroke: config.canvas[`${meta.mode}Stroke`],
            fill: config.canvas[`${meta.mode}Fill`]
          }
        }
        : s
    )
  })
  setTimeout(() => EventDispatcher.emit('save', newState['shapes']), 200)
  return newState
}

const removeShape = (state, id) => {
  const newState = Object.assign({}, state, {
    dirty: true,
    shapes: [...state.shapes].filter(s => s.id !== id)
  })
  setTimeout(() => EventDispatcher.emit('save', newState['shapes']), 200)
  return newState
}


export function reducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SET_SAVING:
      return setSaving(state, payload)
    case SET_DIRTY:
      return setDirty(state, payload)
    case SET_DRAWING:
      return setDrawing(state, payload)
    case SET_BG_OPACITY:
      return setBgOpacity(state, payload)
    case SET_SELECTED_TOOL:
      return setSelectedTool(state, payload)
    case SET_SELECTED_MODE:
      return setSelectedMode(state, payload)
    case INIT_SHAPES:
      return initShapes(state, payload)
    case ADD_SHAPE:
      return addShape(state, payload)
    case EDIT_SHAPE:
      return editShape(state, payload)
    case EDIT_SHAPE_META:
      return editShapeMeta(state, payload)
    case REMOVE_SHAPE:
      return removeShape(state, payload)
    case RESET_CANVAS:
      return INITIAL_STATE
    case RESET:
      return INITIAL_STATE
    default:
      return state
  }
}
