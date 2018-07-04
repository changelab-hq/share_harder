import React, { PropTypes } from 'react';
import Card from '@material-ui/core/Paper';
import Plot from 'react-plotly.js';

const styles = {
  div: { width: '100%', display: 'inline-block', margin: '20px', position: 'relative' },
  image: { width: '100%' },
  title: { fontSize: '0.75em', margin: '0 3px 0 3px'},
  description: { fontSize: '0.55em', margin: '0 3px 0 3px' },
  statsBox: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
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
            <span>1,405</span><br />
            <span>Trials</span><br />
            <span>4,506</span><br />
            <span>Clicks</span>
          </div>
        </div>
        <div className='col-md-8 col-xs-6'>
          <Plot
            data={[
              {
                x: [2 + Math.random()],
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