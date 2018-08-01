import React, { PropTypes } from 'react';

import TextOverlay from './TextOverlay'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  overlay_icon: { position: 'absolute', top: '0px', right: '0px' }
}


export default class PreviewImage extends React.Component {
  render () {
    return (
    <div className='contains-hover'>
      <IconButton aria-label="Add overlay" onClick={this.props.addOverlay} className='overlay-icon show-on-hover' style={styles.overlay_icon}>
        <Icon>font_download</Icon>
      </IconButton>
      <img src={this.props.src} onBlur={this.props.onBlur} style={this.props.style} onClick={this.props.onClick} />
      { this.props.overlays.map(overlay => (
        <TextOverlay overlay={overlay} key={overlay._id} dispatches={this.props.dispatches} />
      ))}
    </div>
    )
  }
}
