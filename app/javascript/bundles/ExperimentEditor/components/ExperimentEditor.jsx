import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Variants from './Variants'

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Clipboard from 'react-clipboard.js';

import { addVariant, updateVariant, deleteVariant, addOverlay, updateOverlay, deleteOverlay, refreshState, updateExperiment, updateTemplateImage, focusOverlay } from '../actions/experimentEditorActionCreators.js'

const mapStateToProps = (state, ownProps) => {
  return {experiment: state.experiment, unsavedChanges: state.unsavedChanges};
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onUpdateExperiment: (e) => {
      e.preventDefault();
      var el = e.target.closest('.experiment');
      dispatch(updateExperiment({
        name: el.querySelector('.name-input').textContent,
        url: el.querySelector('.url-input').textContent,
      }));
    },
    runSaveExperiment: experimentState => {
      $.ajax({
        url: "/experiments/"+ownProps.experiment.id,
        method: "PUT",
        data: {experiment: experimentState},
        success: (data) => {
          dispatch(refreshState(data))
        }
      });
    },
    // Pass these down to children to allow them to dispatch actions
    dispatches: {
      addOverlay: (template_image_id) => {
        dispatch(addOverlay(template_image_id))
      },
      updateVariant: (data) => {
        dispatch(updateVariant(data))
      },
      updateTemplateImage: (data) => {
        dispatch(updateTemplateImage(data))
      },
      addVariant: (data = {}) => {
        dispatch(addVariant(data));
      },
      updateOverlay: (data) => {
        dispatch(updateOverlay(data))
      },
      deleteVariant: (_id) => {
        dispatch(updateVariant({_id: _id, _destroy: true}))
      },
      deleteOverlay: (_id) => {
        dispatch(deleteOverlay(_id))
      },
      focusOverlay: (_id) => {
        dispatch(focusOverlay(_id))
      },
    }
  }
}


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
      onSaveExperiment: e => {
        e.preventDefault()
        dispatchProps.runSaveExperiment(stateProps.experiment)
      }
    }
}

const styles = {
  url: { color: '#999', 'fontSize': '1.4em' }
}

class ExperimentEditor extends React.Component {
  onCopyUrl () {
    $(".share-url").fadeOut().fadeIn()
  }

  onAddVariant (e) {
    e.preventDefault()
    this.props.dispatches.addVariant()
  }

  render() {
    const clipboardUrl = window.App.APP_URL + '/e/' + this.props.experiment.id + '/share?test=1'

    return (
      <div className='experiment'>
        <h1>Experiment Editor</h1>
        <div className="card">
          <div className="card-header bg-primary">
            <h2>
              <span contentEditable={true} suppressContentEditableWarning={true} onBlur={this.props.onUpdateExperiment} className='name-input'>{this.props.experiment.name}</span> <Icon>edit</Icon>
              <Button style={{'float': 'right'}} variant="contained" href={'/experiments/' + this.props.experiment.id + '/results'}><Icon>bar_chart</Icon> Results</Button>
              &nbsp;
              <Button style={{'float': 'right'}} variant="contained" color="secondary" onClick={this.props.onSaveExperiment} disabled={!this.props.unsavedChanges}><Icon>save</Icon> Save</Button>
            </h2>
          </div>
        </div>
        <div style={styles.url}>
          <span contentEditable={true} suppressContentEditableWarning={true} onBlur={this.props.onUpdateExperiment} className='url-input'>{this.props.experiment.url}</span> <Icon>edit</Icon>
          { this.props.experiment.variants.filter(x => {return x.id }).length == 0 ? '' :
            <span className="float-right share-url">
              <Clipboard component="span" data-clipboard-text={clipboardUrl} onSuccess={this.onCopyUrl.bind(this)}>
                {clipboardUrl} <Icon>file_copy</Icon>
              </Clipboard>
            </span> }
        </div>
        <h2>Variants <Button variant="contained" color="primary" onClick={this.onAddVariant.bind(this)}>+ Add</Button></h2>
        <Variants variants={this.props.experiment.variants} dispatches={this.props.dispatches} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ExperimentEditor)
