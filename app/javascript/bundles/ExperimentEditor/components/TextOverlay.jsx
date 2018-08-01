import React, { PropTypes } from 'react';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  delete_icon: { position: 'absolute', bottom: '0px', right: '-40px' }
}

export default class TextOverlay extends React.Component {
  onClickDelete () {
    this.props.dispatches.deleteOverlay(this.props.overlay._id)
  }

  render () {
    return (
      <div style={{position: 'absolute', top: this.props.overlay.top, left: this.props.overlay.left, fontSize: 20}} className='contains-hover'>
        <span  contentEditable={true} suppressContentEditableWarning={true}>{this.props.overlay.text}</span>
        <IconButton aria-label="Delete" onClick={this.onClickDelete.bind(this)} className='delete-icon show-on-hover' style={styles.delete_icon}>
          <Icon>delete</Icon>
        </IconButton>
      </div>
    )
  }
}
