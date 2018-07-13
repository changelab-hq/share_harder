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
    return (
      <div className='row'>
        <div className='col-md-2 col-xs-3'>
          <Card style={styles.div}>
            <img src={this.props.variant.image_url} style={styles.image} />
            <div style={styles.title} className='title'>{this.props.variant.title}</div>
            <div style={styles.description} className='description'>{this.props.variant.description}</div>
          </Card>
        </div>
        <div className='col-md-2 col-xs-3 text-center' style={styles.statsBox}>
          <div>
            <AnimateOnChange
              baseClassName="stat-number"
              animationClassName="bounce">
              <span>{this.props.variant.share_count}</span>
            </AnimateOnChange><br />
              <span>Shares</span><br />
            <AnimateOnChange
              baseClassName="stat-number"
              animationClassName="bounce">
              <span>{this.props.variant.click_count}</span>
            </AnimateOnChange><br />
            <span>Clicks</span><br />
            <span>{this.props.variant.goal_count}</span><br />
            <span>Goals</span>
          </div>
        </div>
        <div className='col-md-8 col-xs-6'>
          <Plot
            data={[
              {
                x: [this.props.variant.click_count / this.props.variant.share_count],
                y: [1],
                mode: 'markers',
                type: 'scatter',
                error_x: {
                  type: 'data',
                  symmetric: false,
                  array: [Math.random()],
                  arrayminus: [Math.random()]
                }
              }
            ]}
            layout={{width: '100%', height: 200, yaxis: {title: "", zeroline: false, showline: false, showticklabels: false, showgrid:false}, xaxis: {range: [0, 4], zeroline: false}}}
            config={{staticPlot: true}}
          />
        </div>
      </div>
    );
  }
}