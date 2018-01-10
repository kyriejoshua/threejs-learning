import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class App extends Component {
  static propTypes = {
    name: PropTypes.string
  }

  render() {
    return <h1> hello {this.props.name} </h1>
  }
}
