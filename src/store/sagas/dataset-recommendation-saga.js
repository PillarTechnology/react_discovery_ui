import { takeEvery, takeLast } from 'redux-saga/effects'
import { DATASET_DETAILS, datasetRecommendationsSucceeded } from '../actions'
import apiInvoker from './api-invoker'

export default function* datasetRecommendationSaga() {
  yield takeEvery(DATASET_DETAILS, invokeApiWithParameter)
}

const invokeApiWithParameter = ({ value }) => {
  return apiInvoker({ endpoint: `/api/v1/dataset/${value.id}/recommendations`, actionator: datasetRecommendationsSucceeded })()
}
