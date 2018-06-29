import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Variant from './Variant'

export default class Variants extends React.Component {
  static propTypes = {
    variants: PropTypes.array.isRequired
  };

  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = this.props;
  }

  render() {
    console.log("VS", this.props)
    return (
      <div className='row'>
        {this.props.variants.filter(x => {return !x._destroy}).map(variant => (
          <Variant variant={variant} key={variant._id} dispatches={this.props.dispatches} />
        ))}  
      </div>
    );
  }
}