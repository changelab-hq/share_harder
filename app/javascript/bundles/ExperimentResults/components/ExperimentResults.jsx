import React from 'react'
import { connect } from 'react-redux'
import VariantResults from './VariantResults'
import { refreshState } from '../actions/experimentResultsActionCreators'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

const mapStateToProps = (state, ownProps) => {
  return { experiment: state.experiment }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    refreshState: function (data) {
      dispatch(refreshState(data))
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps
  }
}

class ExperimentResults extends React.Component {
  componentDidMount () {
    const propState = this
    App.resultsSubscription = App.cable.subscriptions.create({
      channel: 'ResultsChannel',
      experiment_id: this.props.experiment.id
    }, {
      received: function (data) {
        console.log('Got data!', data)
        propState.props.refreshState(data)
      }
    })
  }

  render () {
    return (
      <div className='experiment'>
        <h1>Experiment Results</h1>
        <Card>
          <CardHeader title={this.props.experiment.name}
            className='bg-primary'
            action={
              <Button style={{ float: 'right' }} variant="contained" href={'/experiments/' + this.props.experiment.id + '/edit'}><Icon>edit</Icon> Edit</Button>
            }
          >
          </CardHeader>
        </Card>

        <Card style={{ overflow: 'visible' }}>
          <CardHeader title='Goals'></CardHeader>
          <CardContent>
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-2" style={{ textAlign: 'center' }}>% of time chosen</div>
              <div className="col-md-6" style={{ textAlign: 'center' }}>Goals per share</div>
            </div>
            <ReactCSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={5000}
              transitionLeaveTimeout={3000}
              transitionAppear={true}
              transitionAppearTimeout={5000}>

              {this.props.experiment.variants.sort((a, b) => b.proportion - a.proportion).map(variant => (
                <VariantResults variant={variant} key={variant.id} highRange={this.props.experiment.high_range} lowRange={this.props.experiment.low_range} />
              ))}

            </ReactCSSTransitionGroup>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ExperimentResults)
