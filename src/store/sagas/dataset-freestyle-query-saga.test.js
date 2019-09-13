import { freestyleQueryDataset, queryDatasetSucceeded, queryDatasetFailed } from '../actions'
import freestyleQuerySaga from './dataset-freestyle-query-saga'
import mockAxios from 'axios'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

jest.mock('axios')

describe('dataset-freestyle-query-saga', () => {
  let store
  let sagaMiddleware
  const reducer = (state = [], action) => {
    return [...state, action]
  }

  const queryText = 'select * from lettuce'

  beforeEach(() => {
    window.API_HOST = 'http://example.com/'

    sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(freestyleQuerySaga)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('success', () => {
    const queryData = [{ hello: "world" }, { hello: "columbus" }]
    const response = {
      status: 200,
      data: queryData
    }

    beforeEach(() => {
      mockAxios.post.mockImplementationOnce(() => (response))

      store.dispatch(freestyleQueryDataset(queryText))
    })

    it('calls multiple query api with query', () => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/v1/query', queryText, {
        baseURL: window.API_HOST,
        withCredentials: true,
        headers: { "Content-Type": "text/plain" },
        validateStatus: false
      })
    })

    it('dispatches a QUERY_DATASET_SUCCEEDED event', () => {
      expect(store.getState()).toContainEqual(queryDatasetSucceeded(queryData))
    })
  })

  describe('failure', () => {
    it('dispatches a QUERY_DATASET_FAILED event based on 400 code', () => {
      const data = "bad things happened"
      const response = {
        status: 400,
        data
      }
      mockAxios.post.mockImplementationOnce(() => (response))

      store.dispatch(freestyleQueryDataset(queryText))

      expect(store.getState()).toContainEqual(queryDatasetFailed(data))
    })

    it('dispatches a QUERY_DATASET_FAILED event on a catastrophic failure', () => {
      const errorMsg = "It's all over"
      mockAxios.post.mockImplementationOnce(() => { throw new Error(errorMsg) })

      store.dispatch(freestyleQueryDataset(queryText))

      expect(store.getState()).toContainEqual(queryDatasetFailed(errorMsg))
    })
  })
})
