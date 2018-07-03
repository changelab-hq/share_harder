import PropTypes from 'prop-types';
import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ExperimentResults from './ExperimentResults.jsx'

import experimentResultsReducer from '../reducers/experimentResultsReducer.js';
import { createStore } from 'redux';

export default class ExperimentResultsApp extends React.Component {
  render () {
    let store = createStore(experimentResultsReducer, this.props);

    console.log("EEA", this.props)
    return (
      <Provider store={store}>
        <ExperimentResults experiment={this.props.experiment} />
      </Provider>
    )  
  }
}
