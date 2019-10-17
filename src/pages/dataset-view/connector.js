import { connect } from 'react-redux'
import DatasetView from './dataset-view'
import { retrieveDatasetDetails, resetQuery, datasetRecommendations } from '../../store/actions'
import { getDataset, isRemoteDataset, isHostDataset, isDatasetLoaded } from '../../store/dataset-selectors'
import { getDatasetRecommendations } from '../../store/selectors'


const mapStateToProps = state => {
    return {
        dataset: getDataset(state),
        isDatasetLoaded: isDatasetLoaded(state),
        isRemoteDataset: isRemoteDataset(state),
        isHostDataset: isHostDataset(state),
        recommendations: getDatasetRecommendations(state),
    }
}

const mapDispatchToProps = dispatch => ({
    retrieveDatasetDetails: (org_name, dataset_name) => dispatch(retrieveDatasetDetails(org_name, dataset_name)),
    resetQuery: () => dispatch(resetQuery()),
    getRecommendations: datasetId => dispatch(datasetRecommendations(datasetId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DatasetView)

