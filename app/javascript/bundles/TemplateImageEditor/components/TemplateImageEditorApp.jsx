import PropTypes from 'prop-types';
import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import TemplateImageEditor from './TemplateImageEditor.jsx'

import templateImageEditorReducer from '../reducers/reducer.js';
import { createStore } from 'redux';

export default class TemplateImageEditorApp extends React.Component {
  render () {
    let store = createStore(templateImageEditorReducer, this.props);

    return (
      <Provider store={store}>
        <TemplateImageEditor template_image={this.props.templateImage} />
      </Provider>
    )
  }
}
