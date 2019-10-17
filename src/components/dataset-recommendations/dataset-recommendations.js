import PropTypes from 'prop-types';
import './dataset-recommendations.scss'
import CollapsableBox from '../collapsable-box'
import { RecommendationUtils } from '../../utils'

const DatasetRecommendations = (props) => {
  const { recommendations } = props
  const isContentUnavailable = !recommendations || recommendations.length == 0

  if (isContentUnavailable) {
    return (
      <dataset-recommendations />
    )
  }

  return (
    <dataset-recommendations>
      <CollapsableBox title={"Recommended Datasets"} expanded={false}>
        <div className="recommendation-content">
          {recommendations.map(rec =>
            <div className="recommended-dataset" key={rec.id}>
              <a href={RecommendationUtils.getDatasetUrl(rec)} target="_blank">{rec.dataTitle}</a>
            </div>)}
        </div>
      </CollapsableBox>
    </dataset-recommendations >
  )
}

DatasetRecommendations.propTypes = {
  recommendations: PropTypes.array
}

export default DatasetRecommendations
