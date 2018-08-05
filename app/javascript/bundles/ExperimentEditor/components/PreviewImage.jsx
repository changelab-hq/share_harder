import React, { PropTypes } from 'react';
import { DropTarget, XYCoord } from 'react-dnd';

import TextOverlay from './TextOverlay'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  overlay_icon: { position: 'absolute', top: '0px', right: '0px' }
}

const dropTarget = { drop(props, monitor) {
  const item = monitor.getItem()
  console.log(monitor)
  console.log(item)
  const delta = monitor.getDifferenceFromInitialOffset()
  console.log(delta)
  const left = Math.round(item.left + delta.x)
  const top = Math.round(item.top + delta.y)

  props.dispatches.updateOverlay({ left: left, top: top, _id: item._id });
} };
function collect(connect, monitor) { return { connectDropTarget: connect.dropTarget(), isOver: monitor.isOver() }; }

class PreviewImage extends React.Component {
  render () {
    const { connectDropTarget } = this.props

    return connectDropTarget(
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

export default DropTarget('textOverlay', dropTarget, collect)(PreviewImage)
