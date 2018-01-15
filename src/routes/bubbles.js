import React, { Component } from 'react'
import * as THREE from 'three'
const P = Math.PI

export default class Bubbles extends Component {
  constructor(props) {
    super(props)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.camera = new THREE.PerspectiveCamera(75, (window.innerWidth - 200) / window.innerHeight, 1, 50)
    this.renderer.setSize( window.innerWidth - 200, window.innerHeight)
  }

  /**
   * [getSpeed get speed for each frame]
   * @return {Number} [description]
   */
  getSpeed() {
    return 2 * P / 60 / 60
  }

  /**
   * [getAngle get angle for every bubble]
   * @param  {Nummber} len [description]
   * @param  {Number} num [description]
   * @return {Number}     [description]
   */
  getAngle(len, num) {
    return (2 * P / len) * num
  }

  initBubble() {
    const bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0x24bbdf, wireframe: true })
    const bubbleGeometry = new THREE.SphereGeometry(1, 32, 32)
    return new THREE.Mesh(bubbleGeometry, bubbleMaterial)
  }

  initBubbles() {
    let bubbles = new THREE.Group()
    const R = 10
    let num = 8
    while (num--) {
      const angle = this.getAngle(8, num)
      const d1 = num % 2 === 0 ? 1 : -1
      const d2 = num % 2 === 0 ? -1 : 1
      const pos = [Math.sin(angle) * R * d1, 5, Math.cos(angle) * R * d2]
      let bubble = this.initBubble()
      bubble.R = 10
      bubble.angle = angle
      bubble.position.set(...pos)
      bubbles.add(bubble)
    }
    return bubbles
  }

  componentDidMount() {
    const bubbles = this.initBubbles()
    this.el.appendChild(this.renderer.domElement)
    this.scene.add(bubbles)
    this.camera.position.set(0, 10, 20)
    const speed = this.getSpeed()
    this.camera.lookAt(this.scene.position)
    this.animate = () => {
      this.animation = window.requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      Array.isArray(bubbles.children) && bubbles.children.map((bubble) => {
        const newPos = [Math.sin(bubble.angle) * bubble.R, 5, Math.cos(bubble.angle) * bubble.R]
        bubble.angle += speed
        bubble.angle = bubble.angle > 2 * P * bubble.R ? bubble.angle - 2 * P * bubble.R : bubble.angle
        bubble.position.set(...newPos)
      })
      // bubble.rotation.x += 0.01
      // bubble.rotation.y += 0.01
    }
    this.animate()
  }

  render() {
    return (<div ref={(el) => this.el = el }/>)
  }

  componentWillUnount() {
    window.cancelAnimationFrame(this.animation)
  }
}
