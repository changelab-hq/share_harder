import * as actionTypes from '../constants/experimentResultsConstants';

function experimentResultsReducer(state, action){
  var newState = JSON.parse(JSON.stringify(state))

  console.log("ACTION: ", action)

  newState.unsavedChanges = !action.type.match(/INIT/) // Assume all actions change state in a way that needs to be persisted

  switch(action.type){
    case actionTypes.REFRESH_STATE:
      newState.unsavedChanges = false
      newState.experiment = JSON.parse(JSON.stringify(action.data.experiment))
      break
  }

  console.log("Old state: ", state)
  console.log("New state: ", newState)
  return newState;
}

export default experimentResultsReducer