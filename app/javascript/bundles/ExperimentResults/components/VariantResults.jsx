import React, { PropTypes } from 'react';
import Card from '@material-ui/core/Paper';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

import AnimateOnChange from 'react-animate-on-change';

const styles = {
  div: { width: '100%', display: 'inline-block', margin: '20px', position: 'relative' },
  image: { width: '100%' },
  title: { fontSize: '0.75em', margin: '0 3px 0 3px'},
  description: { fontSize: '0.55em', margin: '0 3px 0 3px' },
  statsBox: {
    display: 'flex',
    'justifyContent': 'center',
    'alignItems': 'center'
  }
}

export default class VariantResults extends React.Component {
  render() {
    const { highRange, lowRange } = this.props;
    const { image_url, title, description, share_count, click_count, goal_count, proportion, confidence_interval } = this.props.variant

    return (
      <div className='row'>
        <div className='col-md-2 col-xs-3'>
          <Card style={styles.div}>
            <img src={image_url} style={styles.image} />
            <div style={styles.title} className='title'>{title}</div>
            <div style={styles.description} className='description'>{description}</div>
          </Card>
        </div>
        <div className='col-md-2 col-xs-3 text-center' style={styles.statsBox}>
          <div>
            <AnimateOnChange
              baseClassName="stat-number"
              animationClassName="bounce">
              <span>{share_count}</span>
            </AnimateOnChange><br />
              <span>Shares</span><br />
            <AnimateOnChange
              baseClassName="stat-number"
              animationClassName="bounce">
              <span>{click_count}</span>
            </AnimateOnChange><br />
            <span>Clicks</span><br />
            <span>{goal_count}</span><br />
            <span>Goals</span>
          </div>
        </div>
        <div className='col-md-2 col-xs-2'>
          <Plot
              data={[
                {
                  labels: ['Percentage of time chosen', ' '],
                  values: [proportion * 100, (1 - proportion) * 100],
                  type: 'pie',
                  marker: {
                    colors: ['blue','#eee']
                  },
                  textinfo: 'none',
                  sort: false
                }
              ]}
              layout={{width: 200, height: 200, showlegend: false, margin: { l: 30, r: 30, b: 30, t: 30, pad: 20 }, yaxis: {title: "", zeroline: false, showline: false, showticklabels: false, showgrid:false}}}
              config={{staticPlot: true}}
            />
        </div>
        <div className='col-md-6 col-xs-4'>
          <Plot
            data={[
              {
                x: [goal_count / share_count],
                y: [1],
                mode: 'markers',
                type: 'scatter',
                error_x: {
                  type: 'data',
                  symmetric: false,
                  array: [confidence_interval[1]],
                  arrayminus: [confidence_interval[0]]
                }
              }
            ]}
            layout={{width: '100%', height: 200, yaxis: {title: "", zeroline: false, showline: false, showticklabels: false, showgrid:false}, xaxis: {range: [Math.max(lowRange - 0.5,0), highRange + 0.5], zeroline: false}}}
            config={{staticPlot: true}}
          />
        </div>
      </div>
    );
  }
}
