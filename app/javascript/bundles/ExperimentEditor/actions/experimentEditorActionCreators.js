import * as actionTypes from '../constants/experimentEditorConstants'

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

export const addOverlay = (templateImageId) => {
  return {
    type: actionTypes.ADD_OVERLAY,
    template_image_id: templateImageId
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

export const deleteOverlay = (overlayId) => {
  return {
    type: actionTypes.DELETE_OVERLAY,
    overlay_id: overlayId
  }
}

export const focusOverlay = (overlayId) => {
  return {
    type: actionTypes.FOCUS_OVERLAY,
    overlay_id: overlayId
  }
}

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}
