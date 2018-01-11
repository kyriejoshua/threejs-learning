import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class Sidebar extends Component {
  static propTypes = {
    links: PropTypes.array
  }

  render() {
    return Array.isArray(this.props.links) ?
      (<div className="sidebar">
        <div className="sidebar-title">
          <div>Threejs-learning</div>
          <div className="sidebar-title-name">by KyrieJoshua(zzy)</div>
        </div>
        <div className="sidebar-content">
          {
            this.props.links.map((link) => {
              return (<div className="sidebar-item" key={link.id}>
                        <Link to={`/${link.id}`}>
                          {link.desc}
                        </Link>
                      </div>)
            })
          }
        </div>
       </div>
      ) : (<h2>Loading</h2>)
  }

}
