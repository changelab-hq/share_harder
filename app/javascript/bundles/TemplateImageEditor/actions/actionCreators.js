import * as actionTypes from '../constants/constants';
import { connect } from 'react-redux';

export const updateOverlay = (overlay) => {
  return {
    type: actionTypes.UPDATE_OVERLAY,
    overlay: overlay
  }
}

export const addOverlay = (template_image_id) => {
  return {
    type: actionTypes.ADD_OVERLAY,
    template_image_id: template_image_id
  }
}

export const updateTemplateImage = (data) => {
  return {
    type: actionTypes.UPDATE_TEMPLATE_IMAGE,
    data: data
  }
}

export const deleteOverlay = (overlay_id) => {
  return {
    type: actionTypes.DELETE_OVERLAY,
    overlay_id: overlay_id
  }
}

export const focusOverlay = (overlay_id) => {
  return {
    type: actionTypes.FOCUS_OVERLAY,
    overlay_id: overlay_id
  }
}

export const updatePersonalization = (data) => {
  return {
    type: actionTypes.UPDATE_PERSONALIZATION,
    data: data
  }
}

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}


