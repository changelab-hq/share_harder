import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Slider from 'rc-slider';
import FontPicker from 'font-picker-react';
import { TwitterPicker } from 'react-color';


const source = { beginDrag(props) {
    const { _id, left, top } = props.overlay
    return { _id, left, top }
  }
};

const allClosed = {
      size: false,
      color: false,
      font: false,
      stroke: false
    }


function collect(connect, monitor) { return { connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() } }

class TextOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontToolbarOpen: false,
      opens: allClosed
    };
  }

  onClickToolbarIcon() {
    this.setState({ fontToolbarOpen: !this.state.fontToolbarOpen });
  }

  onClickIcon(thing) {
    var obj = {}
    obj[thing] = true
    this.setState( { opens: { ...allClosed, ...obj } } )
  }

  onMouseLeave() {
    this.setState({ fontToolbarOpen: false, opens: { ...allClosed } })
  }

  onClickDelete() {
    this.props.dispatches.deleteOverlay(this.props.overlay._id)
  }

  handleBlur (e) {
    this.props.dispatches.updateOverlay({ _id: this.props.overlay._id, text: e.target.textContent })
  }

  onUpdate(data) {
    this.props.dispatches.updateOverlay({ _id: this.props.overlay._id, ...data })
  }

  render () {
    const { connectDragSource, isDragging } = this.props;
    const textStyle = {
      fontFamily: this.props.overlay.font,
      fontSize: this.props.overlay.size,
      color: this.props.overlay.color,
      WebkitTextStroke: this.props.overlay.textStrokeWidth + 'px ' + this.props.overlay.textStrokeColor
    }

    return connectDragSource(
      <div
        style={{top: this.props.overlay.top, left: this.props.overlay.left}}
        className='overlay contains-hover'
        onMouseLeave={this.onMouseLeave.bind(this)}>
        <Icon className="drag-handle show-on-hover">drag_handle</Icon>
        <span contentEditable={true} suppressContentEditableWarning={true} onBlur={this.handleBlur.bind(this)} style={textStyle}>{this.props.overlay.text}</span>
        <div className="hover-toolbar show-on-hover">
          <IconButton aria-label="Size" className='font-toolbar-icon' onClick={() => this.onClickIcon('size')}>
            <Icon>format_size</Icon>
          </IconButton>
          <IconButton aria-label="Font" className='font-toolbar-icon' onClick={() => this.onClickIcon('font')}>
            <Icon>font_download</Icon>
          </IconButton>
          <IconButton aria-label="Stroke" className='font-toolbar-icon' onClick={() => this.onClickIcon('stroke')}>
            <Icon>format_paint</Icon>
          </IconButton>
          <IconButton aria-label="Color" className='font-toolbar-icon' onClick={() => this.onClickIcon('color')}>
            <Icon>format_color_text</Icon>
          </IconButton>
          <IconButton aria-label="Delete" onClick={this.onClickDelete.bind(this)} className='delete-icon'>
            <Icon>delete</Icon>
          </IconButton>
          <Slider min={3} max={100} defaultValue={this.props.overlay.size} style={{display: this.state.opens.size ? 'inherit' : 'none' }} onChange={v => this.onUpdate({ size: v })} />
          <div style={{display: this.state.opens.font ? 'inherit' : 'none' }}>
            <FontPicker
              apiKey="AIzaSyAj00wPI0c0qAj3VZkQXpU-5AQe3lJa1Oo"
              activeFont={this.props.overlay.font}
              onChange={nextFont => this.onUpdate({ font: nextFont.family })}
            />
          </div>
          <div style={{display: this.state.opens.color ? 'inherit' : 'none' }}>
            <TwitterPicker onChange={color => this.onUpdate({ color: color.hex })} />
          </div>
          <div style={{display: this.state.opens.stroke ? 'inherit' : 'none' }}>
            <TwitterPicker onChange={color => this.onUpdate({ textStrokeColor: color.hex })} />
            <Slider min={0} max={10} defaultValue={this.props.overlay.textStrokeWidth} onChange={v => this.onUpdate({ textStrokeWidth: v })} />
          </div>
        </div>
      </div>
    )
  }
}

export default DragSource('textOverlay', source, collect)(TextOverlay)
