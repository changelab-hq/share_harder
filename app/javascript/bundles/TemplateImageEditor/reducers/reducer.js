import merge from 'deepmerge';
import * as actionTypes from '../constants/constants';
import { addIds, updateThing, findThingBySubthing } from '../../Shared/lib';

function reducer(state, action){
  var newState = JSON.parse(JSON.stringify(state))

  console.log("ACTION: ", action)

  newState = beforeStateUpdate(newState)
  newState.unsavedChanges = !action.type.match(/INIT/) // Assume all actions change state in a way that needs to be persisted

  switch(action.type){
    case actionTypes.REFRESH_STATE:
      newState.unsavedChanges = false
      newState.template_image = JSON.parse(JSON.stringify(action.data.template_image))
      break
    case actionTypes.UPDATE_TEMPLATE_IMAGE:
      newState.template_image = { ...newState.template_image, ...action.data }
      break
    case actionTypes.ADD_OVERLAY:
      newState.template_image.overlays = JSON.parse(JSON.stringify(newState.template_image.overlays))
      newState.template_image.overlays.push({text: 'NEW TEXT', top: 10, left: 10, font: 'Open Sans', size: 20, color: '#ffffff', rotation: 0})
      break
    case actionTypes.UPDATE_OVERLAY:
      newState.template_image.overlays = JSON.parse(JSON.stringify(updateThing(newState.template_image.overlays, action.overlay)))
      break
    case actionTypes.DELETE_OVERLAY:
      newState.template_image.overlays = JSON.parse(JSON.stringify(newState.template_image.overlays.filter(o => o._id !== action.overlay_id)))
      break
  }

  newState = afterStateUpdate(newState);
  console.log("Old state: ", state)
  console.log("New state: ", newState)
  return newState;
}

function beforeStateUpdate(state){
  return state
}

function afterStateUpdate(state){
  var newState = JSON.parse(JSON.stringify(state))
  return addIds(newState)
}

export default reducer
