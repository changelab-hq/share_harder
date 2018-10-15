import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';

import TemplateImage from '../../Shared/components/TemplateImage'
import PersonalizationEditor from '../../Shared/components/PersonalizationEditor'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Clipboard from 'react-clipboard.js';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { addOverlay, updateOverlay, deleteOverlay, refreshState, updateTemplateImage, focusOverlay, updatePersonalization, togglePreview } from '../actions/actionCreators.js'

const mapStateToProps = (state, ownProps) => {
  return {
    template_image: state.template_image,
    unsavedChanges: state.unsavedChanges,
    personalization: state.personalization,
    preview: state.preview
  };
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
      addOverlay: (template_image_id) => {
        dispatch(addOverlay(template_image_id))
      },
      updateOverlay: (data) => {
        dispatch(updateOverlay(data))
      },
      deleteOverlay: (_id) => {
        dispatch(deleteOverlay(_id))
      },
      focusOverlay: (_id) => {
        dispatch(focusOverlay(_id))
      },
      updatePersonalization: (data) => {
        dispatch(updatePersonalization(data))
      },
      togglePreview: () => {
        dispatch(togglePreview())
      }
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
  onCopyUrl () {
    $(".share-url").fadeOut().fadeIn()
  }

  render() {
    const { updateTemplateImage } = this.props.dispatches;
    const { template_image, preview } = this.props;
    const personalization = _.omit(this.props.personalization, '_id')
    const queryString = Object.keys(personalization).map(key => 'm_' + key + '=' + encodeURIComponent(personalization[key])).join('&');
    const clipboardUrl = window.ENV.APP_URL + '/template_images/' + template_image.id + '/image.jpg?' + queryString

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
            <div className='row'>
              <div className='col-md-8'>
                { preview ?
                  <TemplateImage template_image={template_image} dispatches={this.props.dispatches} personalization={personalization} isResizeable={false} />
                  :
                  <TemplateImage template_image={template_image} dispatches={this.props.dispatches} />
                }

              </div>
              <div className='col-md-4'>
                <div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preview}
                        onChange={this.props.dispatches.togglePreview}
                      />
                    }
                    label="Preview"
                  />
                  { preview ?
                    <div>
                      <PersonalizationEditor content={template_image.overlays} personalization={personalization} dispatches={this.props.dispatches} />
                      <Clipboard component="span" data-clipboard-text={clipboardUrl} className='share-url' onSuccess={this.onCopyUrl.bind(this)}>
                      {clipboardUrl} <Icon>file_copy</Icon>
                      </Clipboard>
                    </div> : '' }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DragDropContext(HTML5Backend)(TemplateImageEditor))
