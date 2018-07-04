import React, { PropTypes } from 'react';
import Card from '@material-ui/core/Paper';
import Plot from 'react-plotly.js';

const styles = {
  div: { width: '100%', display: 'inline-block', margin: '20px', position: 'relative' },
  image: { width: '100%' },
  title: { fontSize: '0.75em', margin: '0 3px 0 3px'},
  description: { fontSize: '0.55em', margin: '0 3px 0 3px' }
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
        <div className='col-md-2 col-xs-3 text-center'>
          <div>1,405</div>
          <div>Trials</div>
          <div>4,506</div>
          <div>Clicks</div>
        </div>
        <div className='col-md-8 col-xs-6'>
          <Plot
            data={[
              {
                x: [1, 2, 3, 4, 4, 4, 8, 9, 10],
                type: 'box'
              }
            ]}
            layout={{width: '100%', height: 200}}
          />
        </div>
      </div>
    );
  }
}