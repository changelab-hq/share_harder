import * as actionTypes from '../constants/experimentEditorConstants';
import { connect } from 'react-redux';

export const updateVariant = (variant) => {
  return {
    type: actionTypes.UPDATE_VARIANT,
    variant: variant
  }
}

export const updateOverlay = (variant_id, overlay) => {
  return {
    type: actionTypes.UPDATE_OVERLAY,
    variant_id: variant_id,
    overlay: overlay
  }
}

export const addOverlay = (variant_id) => {
  return {
    type: actionTypes.ADD_OVERLAY,
    variant_id: variant_id
  }
}

export const updateExperiment = (data) => {
  return {
    type: actionTypes.UPDATE_EXPERIMENT,
    data: data
  }
}

export const addVariant = () => {
  return {
    type: actionTypes.ADD_VARIANT
  }
}

export const deleteOverlay = (overlay_id) => {
  return {
    type: actionTypes.DELETE_OVERLAY,
    overlay_id: overlay_id
  }
}

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}


