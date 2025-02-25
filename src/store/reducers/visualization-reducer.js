import {
  VISUALIZATION_LOAD,
  VISUALIZATION_LOAD_SUCCESS,
  VISUALIZATION_LOAD_FAILURE,
  VISUALIZATION_SAVE,
  VISUALIZATION_UPDATE,
  VISUALIZATION_SAVE_SUCCESS,
  VISUALIZATION_SAVE_FAILURE,
  VISUALIZATION_RESET,
  CHART_VISUALIZATION_SAVE
} from "../actions"

const defaultVisualizationState = {
  visualization: {id: undefined},
  chart: {data: [], layout: {}, frames: []},
  loading: false,
  loadSuccess: false,
  loadFailure: false,
  saving: false,
  saveSuccess: false,
  saveFailure: false
}

const visualizationReducer = (state = defaultVisualizationState, action) => {
  switch (action.type) {
    case VISUALIZATION_LOAD:
      return Object.assign({}, state, {
        loading: true,
        loadSuccess: false,
        loadFailure: false
      })
    case VISUALIZATION_LOAD_SUCCESS:
      return Object.assign({}, state, {
        visualization: action.value,
        loading: false,
        loadSuccess: true,
        loadFailure: false
      })
    case VISUALIZATION_LOAD_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loadSuccess: false,
        loadFailure: true
      })
    case VISUALIZATION_SAVE:
      return Object.assign({}, state, {
        saving: true,
        saveSuccess: false,
        saveFailure: false
      })
    case VISUALIZATION_UPDATE:
      return Object.assign({}, state, {
        saving: true,
        saveSuccess: false,
        saveFailure: false
      })
    case VISUALIZATION_SAVE_SUCCESS:
      return Object.assign({}, state, {
        visualization: action.value,
        saving: false,
        saveSuccess: true,
        saveFailure: false
      })
    case VISUALIZATION_SAVE_FAILURE:
      return Object.assign({}, state, {
        saving: false,
        saveSuccess: false,
        saveFailure: true
      })
    case CHART_VISUALIZATION_SAVE:
      return Object.assign({}, state, {
        chart: action.value
      })
    case VISUALIZATION_RESET:
      return defaultVisualizationState
    default: return state
  }
}

export default visualizationReducer