import * as actionTypes from '../constants/experimentEditorConstants'
import { connect } from 'react-redux'

export const updateVariant = (variant) => {
  return {
    type: actionTypes.UPDATE_VARIANT,
    variant: variant
  }
}

export const updateTemplateImage = (data) => {
  return {
    type: actionTypes.UPDATE_TEMPLATE_IMAGE,
    data: data
  }
}

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

export const updateExperiment = (data) => {
  return {
    type: actionTypes.UPDATE_EXPERIMENT,
    data: data
  }
}

export const addVariant = (data = {}) => {
  return {
    type: actionTypes.ADD_VARIANT,
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

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}
