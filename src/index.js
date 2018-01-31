import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App.js'
import Sidebar from './Sidebar.js'
import links from './links.js'
import routes from './routes/index.js'
import './index.less'

const app = document.querySelector('#app')

ReactDOM.render(
  <Router>
    <div className="wrapper">
      <Sidebar links={links}/>
      <div className="content">
        <Route exact={true} path="/" component={App}/>
        <Route path="/home" render={() => (<div style={{ padding: '20px' }}><h2>Welcome</h2></div>)}/>
        <Route path="/creating-a-scene" component={routes.HelloScene}/>
        <Route path="/bubbles" component={routes.Bubbles}/>
        <Route path='/solar-system' component={routes.SolarSystem}/>
      </div>
    </div>
  </Router>
  , app)
