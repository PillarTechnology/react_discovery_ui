import { connect } from 'react-redux'
import VisualizationView from './visualization-view'
import { visualizationLoad, visualizationReset, visualizationSave, visualizationUpdate } from '../../store/actions'
import { getFreestyleQueryText } from '../../store/query-selectors'
import { visualizationTitle, visualizationSaving, isVisualizationSaveable, visualizationSaveSuccess, visualizationID, visualizationLoadFailure, visualizationSaveFailure, visualizationChart} from '../../store/visualization-selectors'

const mapStateToProps = state => {
    return {
        id: visualizationID(state),
        title: visualizationTitle(state),
        query: getFreestyleQueryText(state),
        isLoadFailure: visualizationLoadFailure(state),
        isSaving: visualizationSaving(state),
        isSaveFailure: visualizationSaveFailure(state),
        isSaveSuccess: visualizationSaveSuccess(state),
        isSaveable: isVisualizationSaveable(state),
        chart: visualizationChart(state)
    }
}

const mapDispatchToProps = dispatch => ({
    load: (id) => dispatch(visualizationLoad(id)),
    reset: () => dispatch(visualizationReset()),
    save: (title, query, chart) => dispatch(visualizationSave(title, query, chart)),
    update: (id, title, query) => dispatch(visualizationUpdate(id, title, query))
})

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationView)

