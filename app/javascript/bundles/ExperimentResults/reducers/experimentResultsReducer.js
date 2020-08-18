import * as actionTypes from '../constants/experimentResultsConstants'

function experimentResultsReducer (state, action) {
  var newState = JSON.parse(JSON.stringify(state))

  console.log('ACTION: ', action)

  switch (action.type) {
    case actionTypes.REFRESH_STATE:
      newState = JSON.parse(JSON.stringify(action.data))
      break
  }

  console.log('Old state: ', state)
  console.log('New state: ', newState)
  return newState
}

export default experimentResultsReducer
