import React from 'react';
import PropTypes from 'prop-types';
import Mustache from 'mustache';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

const getFieldsFromContent = (content) => {
  var tags = []

  for(let c of content) {
    Mustache.parse(c.text)
     .filter(function(v) { return v[0] === 'name' })
     .forEach(function(v) { tags.push(v[1]) })
  }

  return [...new Set(tags)]
}

export default class TemplateImage extends React.Component {
  static propTypes = {
    content: PropTypes.array.isRequired,
    values: PropTypes.object
  }

  render () {
    const tags = getFieldsFromContent(this.props.content)
    const { updatePersonalization } = this.props.dispatches
    const { personalization } = this.props

    return (<div>
      { tags.map(tag => (
        <div key={tag}>
          <TextField
            id={tag}
            label={tag}
            className={''}
            value={personalization[tag]}
            onChange={(e) => {
              var data = {}
              data[tag] = e.target.value
              updatePersonalization(data)
            }}
            margin="normal"
          />
        </div>
        )) }
      </div>)
  }
}
