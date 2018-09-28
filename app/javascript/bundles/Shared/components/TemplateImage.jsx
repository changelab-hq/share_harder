import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget, XYCoord } from 'react-dnd';
import { ResizableBox } from 'react-resizable';

import TextOverlay from './TextOverlay'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  overlay_icon: { position: 'absolute', top: '0px', right: '0px' }
}

const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;

class TemplateImage extends React.Component {
  static propTypes = {
    template_image: PropTypes.shape({
      overlays: PropTypes.array.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    dispatches: PropTypes.shape({
      addOverlay: PropTypes.func.isRequired,
      updateTemplateImage: PropTypes.func.isRequired
    }),
    isResizeable: PropTypes.bool
  }

  static defaultProps = {
    isResizeable: true
  }

  constructor(props) {
    super(props);

    this.state = { showUrl: false };
  }

  showUrl(e){
    this.setState({ showUrl: true })
  }

  hideUrl(e) {
    this.setState({ showUrl: false })
    this.props.dispatches.updateTemplateImage({url: e.target.value, _id: this.props.template_image._id})
  }

  onMouseLeave(e) {
    this.props.dispatches.focusOverlay(null)
  }

  render () {
    const { dispatches, connectDropTarget, isResizeable, personalization } = this.props
    const { url, overlays, height, width } = this.props.template_image
    const { addOverlay, updateTemplateImage } = dispatches

    return connectDropTarget(
      <div className="template-image">
        <div>
          <div style={{width: width, height: height, position: 'relative'}} className='contains-hover'>
            <IconButton aria-label="Add overlay" onClick={(e) => addOverlay(this.props.template_image._id)} className='overlay-icon show-on-hover' style={styles.overlay_icon}>
              <Icon>font_download</Icon>
            </IconButton>
            <ConditionalWrap
              condition={isResizeable}
              wrap={children => <ResizableBox width={width} height={height} onResizeStop={(e, { size }) => updateTemplateImage({width: size.width, height: size.height})}>{children}</ResizableBox>}
            >
              <img src={url} onBlur={this.props.onBlur} style={{width: '100%', height: '100%'}} onClick={this.showUrl.bind(this)} onBlur={this.hideUrl.bind(this)}  onMouseLeave={this.onMouseLeave.bind(this)} />
              { overlays.map(overlay => (
                <TextOverlay overlay={overlay} key={overlay._id} dispatches={dispatches} personalization={personalization} />
              ))}
            </ConditionalWrap>
          </div>
        </div>
        { this.state.showUrl ?
          <input className='form-control' style={styles.image_url} onBlur={this.hideUrl.bind(this)} defaultValue={url} /> : '' }
      </div>
    )
  }
}

const dropTarget = {
  drop(props, monitor) {
    const item = monitor.getItem()
    const delta = monitor.getDifferenceFromInitialOffset()
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)

    props.dispatches.updateOverlay({ left: left, top: top, _id: item._id });
  }
}

const collect = function (connect, monitor) {
  return { connectDropTarget: connect.dropTarget(), isOver: monitor.isOver() };
}

export default DropTarget('textOverlay', dropTarget, collect)(TemplateImage)
