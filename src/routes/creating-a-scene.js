import React, { Component } from 'react'
import * as THREE from 'three'

export default class HelloScene extends Component {

  initCube() {
    let cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0041ff })
    let cubeGeogemery = new THREE.BoxGeometry(1, 1, 1);
    return new THREE.Mesh(cubeGeogemery, cubeMaterial)
  }

  componentDidMount() {
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer()
    let camera = new THREE.PerspectiveCamera(75, this.el.clientHeight / this.el.clientWidth, 1, 100)
    let cube = this.initCube()
    // except the sidebar
    renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    // default color is just black
    renderer.setClearColor(new THREE.Color(0x000000))
    scene.add(cube)
    this.el.appendChild(renderer.domElement)
    camera.position.set(0, 0, 10)
    camera.lookAt(scene.position)
    this.animate = () => {
      this.animation = window.requestAnimationFrame(this.animate)
      renderer.render(scene, camera)
      cube.rotation.x += 0.02
      cube.rotation.y += 0.02
    }
    this.animate(renderer, scene, camera, cube)
  }

  render() {
    return (<div className="content-wrapper" ref={(el) => this.el = el}/>)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animation)
  }
}
