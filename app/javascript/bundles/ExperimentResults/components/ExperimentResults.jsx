import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import VariantResults from './VariantResults'

const mapStateToProps = (state, ownProps) => {
  return { experiment: state.experiment };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps, 
    ...dispatchProps
    }
}

class ExperimentResults extends React.Component {
  render() {
    return (
      <div className='experiment'>
        <h1>Experiment Results</h1>
        <h2>{this.props.experiment.name}</h2>
        <div className="card">
          <div className="card-header bg-primary">
            <h3>Clicks</h3>
          </div>
          <div className="card-body">
            {this.props.experiment.variants.map(variant => (
              <VariantResults variant={variant} key={variant.id} />
            ))}  
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ExperimentResults)

