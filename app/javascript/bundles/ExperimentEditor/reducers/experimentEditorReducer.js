import * as actionTypes from '../constants/experimentEditorConstants';

function experimentEditorReducer(state, action){
  var newState = JSON.parse(JSON.stringify(state))

  console.log("ACTION: ", action)

  newState = beforeStateUpdate(newState)
  newState.unsavedChanges = !action.type.match(/INIT/) // Assume all actions change state in a way that needs to be persisted

  switch(action.type){
    case actionTypes.REFRESH_STATE:
      newState.unsavedChanges = false
      newState.experiment = JSON.parse(JSON.stringify(action.data.experiment))
      break
    case actionTypes.UPDATE_VARIANT:
      newState.experiment.variants = updateThing(newState.experiment.variants, action.variant)
      break
    case actionTypes.UPDATE_EXPERIMENT:
      newState.experiment = { ...newState.experiment, ...action.data }
      break
    case actionTypes.ADD_VARIANT:
      newState.experiment.variants.push({title: 'New variant', description: 'Description here', image_url: 'http://via.placeholder.com/516x270', overlays: [{text: 'Testipop', top: 123, left: 34}, {text: 'Other fun text', top: 200, left: 134}]})
      break
    case actionTypes.ADD_OVERLAY:
      var variant = newState.experiment.variants.find(v => v._id === action.variant_id)
      variant.overlays = JSON.parse(JSON.stringify(variant.overlays))
      variant.overlays.push({text: 'NEW TEXT', top: 10, left: 10})
      break
    case actionTypes.UPDATE_OVERLAY:
      var variant = newState.experiment.variants.find(v => {v._id === action.variant_id})
      variant.overlays = updateOverlay(overlays, action.overlay)
      break
    case actionTypes.DELETE_OVERLAY:
      var variant = findThingBySubthing(newState.experiment.variants, 'overlays', action.overlay_id)
      variant.overlays = JSON.parse(JSON.stringify(variant.overlays.filter(o => o._id !== action.overlay_id)))
      break
  }

  newState = afterStateUpdate(newState);
  console.log("Old state: ", state)
  console.log("New state: ", newState)
  return newState;
}

// Takes a collection of thing and updates one of them using _id as key
function updateThing(things, updateThing){
  var newThings = JSON.parse(JSON.stringify(things))

  var index = 0
  for(let thing of newThings){
    if (thing._id == updateThing._id){
      var locatedThingIndex = index
    }
    index++
  }

  newThings[locatedThingIndex] = Object.assign(newThings[locatedThingIndex], updateThing)
  return newThings
}

// Takes a collection of things and returns the thing that contains the subthing with _id as key
function findThingBySubthing(things, subthings_name, _id){
  for (let thing of things){
    for (let subthing of thing[subthings_name]){
      if (subthing._id === _id){
        return thing
      }
    }
  }
}

function beforeStateUpdate(state){
  return state
}

function afterStateUpdate(state){
  var newState = JSON.parse(JSON.stringify(state))
  var variantIndex = 0

  for (let variant of newState.experiment.variants) {
    var overlayIndex = 0
    for (let overlay of newState.experiment.variants[variantIndex].overlays) {
      if (!overlay._id){
        newState.experiment.variants[variantIndex].overlays[overlayIndex]._id = makeId()
      }
      overlayIndex++;
    }
    if (!variant._id){
      newState.experiment.variants[variantIndex]._id = makeId()
    }
    variantIndex++;
  }

  return newState
}

function makeId(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 16; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default experimentEditorReducer
