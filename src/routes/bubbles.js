import React, { Component } from 'react'
import * as THREE from 'three'
const P = Math.PI

export default class Bubbles extends Component {
  constructor(props) {
    super(props)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
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

  rotatingBubbles(bubbles, speed, timer = 5000 /* stop time */) {
    if (!Array.isArray(bubbles.children)) { return }
    const self = this
    bubbles.children.map((bubble) => {
      if (self.shouldStop) { return }
      const currentDistance = Math.cos(bubble.angle) * bubble.R
      const lastDistance = Math.cos(bubble.angle - speed) * bubble.R
      const newPos = [Math.sin(bubble.angle) * bubble.R, 5, currentDistance]
      bubble.angle += speed
      bubble.angle = bubble.angle > 2 * P * bubble.R ? bubble.angle - 2 * P * bubble.R : bubble.angle
      const nextDistance = Math.cos(bubble.angle) * bubble.R
      // when it is closest to you
      self.shouldStop = currentDistance > nextDistance && currentDistance > lastDistance
      if (self.shouldStop) {
        self.timeout = window.setTimeout(() => {
          self.shouldStop = false
          window.clearTimeout(self.timeout)
        }, timer)
      }
      bubble.position.set(...newPos)
    })
  }

  componentDidMount() {
    const bubbles = this.initBubbles()
    const speed = this.getSpeed()
    this.shouldStop = false
    this.el.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    this.scene.add(bubbles)
    this.camera = new THREE.PerspectiveCamera(75, this.el.clientWidth / this.el.clientHeight, 1, 50)
    this.camera.position.set(0, 10, 20)
    this.camera.lookAt(this.scene.position)
    this.animate = () => {
      this.animation = window.requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      this.rotatingBubbles(bubbles, speed)
      // bubble.rotation.x += 0.01
      // bubble.rotation.y += 0.01
    }
    this.animate()
  }

  render() {
    return (<div className="content-wrapper" ref={(el) => this.el = el }/>)
  }

  componentWillUnount() {
    window.cancelAnimationFrame(this.animation)
  }
}
