import PropTypes from 'prop-types';
import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ExperimentEditor from './ExperimentEditor.jsx'

import experimentEditorReducer from '../reducers/experimentEditorReducer.js';
import { createStore } from 'redux';

export default class ExperimentEditorApp extends React.Component {
  render () {
    let store = createStore(experimentEditorReducer, this.props);

    console.log("EEA", this.props)
    return (
      <Provider store={store}>
        <ExperimentEditor experiment={this.props.experiment} />
      </Provider>
    )  
  }
}
