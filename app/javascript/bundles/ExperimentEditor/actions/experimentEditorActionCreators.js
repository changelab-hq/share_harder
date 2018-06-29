import * as actionTypes from '../constants/experimentEditorConstants';
import { connect } from 'react-redux';

export const updateVariant = (data) => {
  return {
    type: actionTypes.UPDATE_VARIANT,
    data: data
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

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}


