import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

class Hello extends Component {
  // static propTypes = {
    // name: PropTypes.string
  // }

  render() {
    return <div> hello { this.props.name } </div>    
  }
}

const app = document.body.querySelector('#app')
ReactDOM.render(<Hello name='three.js'/>, app)

