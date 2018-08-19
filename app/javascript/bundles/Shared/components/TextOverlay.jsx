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
      stroke: false,
      align: false,
      rotate: false
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
    this.props.dispatches.deleteOverlay(_id)
  }

  handleBlur (e) {
    this.props.dispatches.updateOverlay({ _id: _id, text: e.target.textContent })
  }

  onUpdate(data) {
    this.props.dispatches.updateOverlay({ _id: this.props.overlay._id, ...data })
  }

  render () {
    const { connectDragSource, isDragging } = this.props;
    const { top, left, align, font, size, color, rotation, textStrokeWidth, textStrokeColor, text } = this.props.overlay

    const overlayStyle = {
      top: top,
      left: align ? 0 : left,
      width: align ? "100%" : 'auto',
      textAlign: align ? align : 'left'
    }

    const textStyle = {
      fontFamily: font,
      fontSize: size,
      fontWeight: 700,
      color: color,
      WebkitTextStroke: textStrokeWidth + 'px ' + textStrokeColor
    }

    var rotationStyle = {transform: 'rotate('+rotation+'deg)', transformOrigin: '0 100%'}
    console.log(rotation)
    if (rotation < 0) {
      console.log('do it')
      var rotationStyle = {transform: 'rotate('+rotation+'deg)', transformOrigin: '0 0'}
    }

    return connectDragSource(
      <div
        style={overlayStyle}
        className='overlay contains-hover'
        onMouseLeave={this.onMouseLeave.bind(this)}>
        <Icon className="drag-handle show-on-hover">drag_handle</Icon>
        <div style={rotationStyle}>
          <span contentEditable={true} suppressContentEditableWarning={true} onBlur={e => this.onUpdate({ text: e.target.textContent })} style={textStyle}>{text}</span>
        </div>
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
          <IconButton aria-label="Color" className='font-toolbar-icon' onClick={() => this.onClickIcon('align')}>
            <Icon>format_align_justify</Icon>
          </IconButton>
          <IconButton aria-label="Color" className='font-toolbar-icon' onClick={() => this.onClickIcon('rotate')}>
            <Icon>rotate_right</Icon>
          </IconButton>
          <IconButton aria-label="Delete" onClick={this.onClickDelete.bind(this)} className='delete-icon'>
            <Icon>delete</Icon>
          </IconButton>
          <div style={{display: this.state.opens.size ? 'inherit' : 'none' }}>
            <span>Size</span>
            <Slider min={3} max={100} defaultValue={size}  onChange={v => this.onUpdate({ size: v })} className="slider" />
          </div>
          <div style={{display: this.state.opens.rotate ? 'inherit' : 'none' }}>
            <span>Rotation</span>
            <Slider min={-180} max={180} defaultValue={rotation}  onChange={v => this.onUpdate({ rotation: v })} className="slider" />
          </div>
          <div style={{display: this.state.opens.font ? 'inherit' : 'none' }}>
            <FontPicker
              apiKey={process.env.GOOGLE_FONTS_API_KEY}
              activeFont={font}
              onChange={nextFont => this.onUpdate({ font: nextFont.family })}
              variants={['700']}
            />
          </div>
          <div style={{display: this.state.opens.color ? 'inherit' : 'none' }}>
            <TwitterPicker onChange={color => this.onUpdate({ color: color.hex })} />
          </div>
          <div style={{display: this.state.opens.stroke ? 'inherit' : 'none' }}>
            <TwitterPicker onChange={color => this.onUpdate({ textStrokeColor: color.hex })} />
            <span>Width</span>
            <Slider min={0} max={10} defaultValue={textStrokeWidth} onChange={v => this.onUpdate({ textStrokeWidth: v })} className="slider" />
          </div>
          <div style={{display: this.state.opens.align ? 'inherit' : 'none' }}>
            <IconButton aria-label="No align" onClick={e => this.onUpdate({align: ''})} className='delete-icon'><Icon>format_clear</Icon></IconButton>
            <IconButton aria-label="Left" onClick={e => this.onUpdate({align: 'left'})} className='delete-icon'><Icon>format_align_left</Icon></IconButton>
            <IconButton aria-label="Center" onClick={e => this.onUpdate({align: 'center'})} className='delete-icon'><Icon>format_align_center</Icon></IconButton>
            <IconButton aria-label="Right" onClick={e => this.onUpdate({align: 'right'})} className='delete-icon'><Icon>format_align_right</Icon></IconButton>
          </div>
        </div>
      </div>
    )
  }
}

export default DragSource('textOverlay', source, collect)(TextOverlay)
