import PlotlyEditor, { DefaultEditor, SingleSidebarItem, Button } from 'react-chart-editor'
import 'react-chart-editor/lib/react-chart-editor.ie.css'
import { dereference } from 'react-chart-editor/lib'
import './chart-visualization.css'
import plotly from 'plotly.js/dist/plotly'
import { Component } from 'react'
import { isEqual, cloneDeep } from 'lodash'

const hasDataSources = dataSources => {
  return dataSources && Object.keys(dataSources).length > 0
}

const getDataSourceOptions = dataSources => {
  return Object.keys(dataSources).map(name => ({
    value: name,
    label: name,
  }));
}

export default class ChartVisualization extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [], layout: {}, frames: [] }

    this.updatePlot = this.updatePlot.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.dataSources, this.props.dataSources)) {
      this.updatePlot()
    }
  }

  updatePlot() {
    this.setState((state, props) => {
      const data = cloneDeep(state.data)
      dereference(data, props.dataSources)

      // TODO figure out what to do if/when data and dataSources no longer line up
      // (i.e. a selected trace column is no longer in the dataSources)
      return {
        data,
        layout: {...state.layout, datarevision: state.layout.datarevision + 1}
      }
    })
  }

  render() {
    return (
      <chart-visualization>
        {
          hasDataSources(this.props.dataSources) &&
          <PlotlyEditor
            data={this.state.data}
            layout={this.state.layout}
            frames={this.state.frames}
            dataSources={this.props.dataSources}
            dataSourceOptions={getDataSourceOptions(this.props.dataSources)}
            plotly={plotly}
            onUpdate={(data, layout, frames) => this.setState({ data, layout, frames })}
            useResizeHandler
            advancedTraceTypeSelector
            config={{ mapboxAccessToken: window.MAPBOX_ACCESS_TOKEN }}
          >
            <DefaultEditor logoSrc={window.LOGO_URL} />
          </PlotlyEditor>

        }
      </chart-visualization>
    )
  }
}
