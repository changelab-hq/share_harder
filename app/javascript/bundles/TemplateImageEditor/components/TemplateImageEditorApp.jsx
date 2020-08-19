import React from 'react'
import { Provider } from 'react-redux'
import TemplateImageEditor from './TemplateImageEditor.jsx'

import templateImageEditorReducer from '../reducers/reducer.js'
import { createStore } from 'redux'

export default class TemplateImageEditorApp extends React.Component {
  render () {
    const store = createStore(templateImageEditorReducer, this.props)

    return (
      <Provider store={store}>
        <TemplateImageEditor template_image={this.props.templateImage} />
      </Provider>
    )
  }
}
