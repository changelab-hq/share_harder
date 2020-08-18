import * as actionTypes from '../constants/experimentResultsConstants'
import { connect } from 'react-redux'

export const refreshState = (data) => {
  return {
    type: actionTypes.REFRESH_STATE,
    data: data
  }
}
