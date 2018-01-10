import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App.js'

const app = document.querySelector('#app')

ReactDOM.render(
  <Router>
    <div>
      <Route exact={true} path="/" component={App}/>
      <Route path="/home" render={() => (<h2>Welcome</h2>)}/>
    </div>
  </Router>
  , app)

