import * as actionTypes from '../constants/experimentResultsConstants'

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}
