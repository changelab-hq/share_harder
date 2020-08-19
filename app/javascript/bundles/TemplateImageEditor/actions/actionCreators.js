import * as actionTypes from '../constants/constants'

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

export const updateTemplateImage = (data) => {
  return {
    type: actionTypes.UPDATE_TEMPLATE_IMAGE,
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

export const togglePreview = () => {
  return {
    type: actionTypes.TOGGLE_PREVIEW
  }
}
