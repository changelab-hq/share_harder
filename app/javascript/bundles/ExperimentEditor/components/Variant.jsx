import React, { PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import PreviewImage from './PreviewImage'

import Card from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  div: { width: 540, display: 'inline-block', margin: '20px', position: 'relative' },
  caption: { fontSize: '0.8em', margin: '0 10px 0 10px' },
  image: { width: 540, height: 300 },
  title: { fontSize: '1.3em', margin: '0 10px 0 10px'},
  description: { fontSize: '0.9em', margin: '0 10px 0 10px' },
  image_url: { width: '100%', padding: '10px', display: 'none' },
  delete_icon: { position: 'absolute', bottom: '3px', right: '10px' }
}

class Variant extends React.Component {
  constructor(props) {
    super(props);

    this.state = { dialog_open: false };
  }

  showEditImage(e){
    var variantEl = e.target.closest('.variant');
    variantEl.querySelector('.image-url').style.display = 'inherit'
    variantEl.querySelector('.image-url').focus()
  }

  onUpdate(e) {
    e.preventDefault();
    var variantEl = e.target.closest('.variant');

    this.props.dispatches.updateVariant({
      _id: this.props.variant._id,
      title: variantEl.querySelector('.title').textContent,
      description: variantEl.querySelector('.description').textContent,
      image_url: variantEl.querySelector('.image-url').value
    })
  }

  updateImage(e) {
    var variantEl = e.target.closest('.variant');
    variantEl.querySelector('.image-url').style.display = 'none'
    this.onUpdate(e)
  }

  handleDeleteClick = () => {
    this.setState({ dialog_open: true });
  }

  handleDeleteConfirm = (e) => {
    this.setState({ dialog_open: false });
    this.props.dispatches.deleteVariant(this.props.variant._id)
  }

  handleClose = () => {
    this.setState({ dialog_open: false });
  }

  handleClickAddOverlay () {
    this.props.dispatches.addOverlay(this.props.variant._id)
  }

  render() {
    const { addVariant } = this.props.dispatches

    return (
      <div className='col-lg-6 variant'>
        <Card style={styles.div} className="contains-hover">
          <div style={styles.delete_icon} className="show-on-hover" >
            <IconButton aria-label="Clone" onClick={(e) => addVariant({...this.props.variant})}>
              <Icon>filter_none</Icon>
            </IconButton>
            <IconButton aria-label="Delete" onClick={this.handleDeleteClick}>
              <Icon>delete</Icon>
            </IconButton>
          </div>
          <PreviewImage src={this.props.variant.image_url} onBlur={this.updateImage.bind(this)} style={styles.image} onClick={this.showEditImage} overlays={this.props.variant.overlays} dispatches={this.props.dispatches} addOverlay={this.handleClickAddOverlay.bind(this)} />
          <input className='image-url form-control hidden' style={styles.image_url} onBlur={this.updateImage.bind(this)} defaultValue={this.props.variant.image_url} />
          <div style={styles.title} className='title' contentEditable={true} suppressContentEditableWarning={true}  onBlur={this.onUpdate.bind(this)}>{this.props.variant.title}</div>
          <div style={styles.description} className='description' contentEditable={true} suppressContentEditableWarning={true} onBlur={this.onUpdate.bind(this)}>{this.props.variant.description}</div>
        </Card>
        <Dialog
          open={this.state.dialog_open}
          onClose={this.handleClose}
          aria-Labelledby="alert-dialog-title"
          aria-Describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete this variant?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete this variant then any shares associated with it will also be deleted. It is not advisable to do this with a running campaign.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteConfirm.bind(this)} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Variant)
