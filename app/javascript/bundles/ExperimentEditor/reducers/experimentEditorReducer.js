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
      newState.experiment.variants = updateVariant(newState.experiment.variants, action.data)
      break
    case actionTypes.UPDATE_EXPERIMENT:
      newState.experiment = { ...newState.experiment, ...action.data }
      break
    case actionTypes.ADD_VARIANT:
      newState.experiment.variants.push({title: 'New variant', description: 'Description here', image_url: 'http://via.placeholder.com/516x270'})
      break
  }

  newState = afterStateUpdate(newState);
  console.log("Old state: ", state)
  console.log("New state: ", newState)
  return newState;
}

function updateVariant(variants, data){
  var newVariants = JSON.parse(JSON.stringify(variants))

  var variantIndex = 0
  for (let variant of newVariants) {
    if (data.variant._id == variant._id){
      var locatedVariantIndex = variantIndex;
    }
    variantIndex++; 
  }

  newVariants[locatedVariantIndex] = Object.assign(newVariants[locatedVariantIndex], data.variant)
  console.log('newVariants', newVariants)
  return newVariants;
}

function beforeStateUpdate(state){
  return state
}

function afterStateUpdate(state){
  var newState = JSON.parse(JSON.stringify(state))
  var variantIndex = 0

  for (let variant of newState.experiment.variants) {
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