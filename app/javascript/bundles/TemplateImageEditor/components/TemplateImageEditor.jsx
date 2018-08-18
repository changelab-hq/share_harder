import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import TemplateImage from '../../Shared/components/TemplateImage'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Clipboard from 'react-clipboard.js';

import { addOverlay, updateOverlay, deleteOverlay, refreshState, updateTemplateImage } from '../actions/actionCreators.js'

const mapStateToProps = (state, ownProps) => {
  return {template_image: state.template_image, unsavedChanges: state.unsavedChanges};
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    runSaveTemplateImage: templateImageState => {
      $.ajax({
        url: "/template_images/"+templateImageState.id,
        method: "PUT",
        data: {template_image: templateImageState},
        success: (data) => {
          dispatch(refreshState(data))
        }
      });
    },
    dispatches: {
      updateTemplateImage: (data) => {
        dispatch(updateTemplateImage(data))
      },
      addOverlay: (variant_id) => {
        dispatch(addOverlay(variant_id))
      },
      updateOverlay: (data) => {
        dispatch(updateOverlay(data))
      },
      deleteOverlay: (_id) => {
        dispatch(deleteOverlay(_id))
      },
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    onSaveTemplateImage: e => {
      e.preventDefault()
      dispatchProps.runSaveTemplateImage(stateProps.template_image)
    }
  }
}

const styles = {
  url: { color: '#999', 'fontSize': '1.4em' },
  image: { width: 540, height: 300 },
}

class TemplateImageEditor extends React.Component {
  render() {
    const { updateTemplateImage } = this.props.dispatches
    const { template_image } = this.props

    return (
      <div className='template_image'>
        <h1>Meme Editor</h1>
        <div className="card">
          <div className="card-header bg-primary">
            <h2>
              <span contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => updateTemplateImage({name: e.target.textContent})} className='name-input'>{template_image.name}</span> <Icon>edit</Icon>
              <Button style={{'float': 'right'}} variant="contained" color="secondary" onClick={this.props.onSaveTemplateImage} disabled={!this.props.unsavedChanges}><Icon>save</Icon> Save</Button>
            </h2>
          </div>
          <div className="card-body">
            <TemplateImage template_image={template_image} dispatches={this.props.dispatches} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DragDropContext(HTML5Backend)(TemplateImageEditor))
