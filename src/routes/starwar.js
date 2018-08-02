import React, { Component } from 'react'
import * as THREE from 'three'
import EarthPic from './../assets/amcharts.jpg'
// import EarthPic from './../assets/satelite.jpg'
import StarPic from './../assets/star.png'
import Font from './../assets/fonts/helvetiker_regular.typeface.json'

const P = Math.PI
const fontStyle = {
  size: 0.5,
  height: 0.02,
  curveSegments: 12,
  bevelEnabled: false,
  bevelThickness: 1,
  bevelSize: 0.8
}

export default class Starwar extends Component {
  constructor(props) {
    super(props)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.font = Object.assign(fontStyle, { font: this.loadFont() })
  }

  initEarth() {
    const textureEarth = new THREE.TextureLoader().load(EarthPic || '')
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: textureEarth })
    let earth = this.earth = new THREE.Mesh(sphereGeometry, sphereMaterial)
    earth.position.set(0, -1, -3.2)
    this.scene.add(earth)
    return this
  }

  loadFont() {
    return new THREE.Font(Font)
  }

  initStars() {
    let textureStar = new THREE.TextureLoader().load(StarPic)
    let starsGeometry = new THREE.Geometry()
    for (let i = 0; i < 200; i++) {
      let star = new THREE.Vector3()
      star.x = THREE.Math.randFloatSpread(50)
      star.y = THREE.Math.randFloatSpread(50)
      star.z = THREE.Math.randFloatSpread(50)
      starsGeometry.vertices.push(star)
    }
    let starsMaterial = new THREE.PointsMaterial({
      color: 0xcfee90, map: textureStar, size: 1,
      transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthTest: false
    })
    let starField = new THREE.Points(starsGeometry, starsMaterial)
    this.scene.add(starField)
    return this
  }
  /**
 * [initLight light part]
 * @return {Object} [description]
 */
  initLight() {
    let light = new THREE.PointLight(0xfafaf6, 1.5, 100)
    light.position.set(-2, 3, 10)
    this.scene.add(light)
    return this
  }

  initTexts() {
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xF5C236 })
    let textGroup = this.textGroup = new THREE.Group()
    let tipsGroup = this.tipsGroup = new THREE.Group()
    let texts = ['Mac deep user', 'ES6 && Typescript', 'React && Redux', 'Git && Github', 'Nodejs', 'Webpack && Gulp', 'WebGL']
    let tips = ['show me more!']
    texts = texts.reverse()
    tips = tips.reverse()
    let textsMesh = {}
    let tipsMesh = {}
    let thatFont = this.font
    texts.map(function(text, index) {
      let textGeometry = new THREE.TextGeometry(text, thatFont)
      textsMesh[index] = new THREE.Mesh(textGeometry, textMaterial)
      textsMesh[index].name = text
      textsMesh[index].position.set(-2.5, -10.5 + index * (0.5 + 0.25), 3.2)
      textGroup.add(textsMesh[index])
    })
    let tipsParams = Object.assign({}, this.font, { size: 0.32, height: 0, bevelThickness: 1, bevelSize: 0.8 })
    let tipMaterial = new THREE.MeshBasicMaterial({ color: 0xF5C236 })
    tips.map(function(tip, index) {
      let textGeometry = new THREE.TextGeometry(tip, tipsParams)
      tipsMesh[index] = new THREE.Mesh(textGeometry, tipMaterial)
      tipsMesh[index].name = tip
      tipsMesh[index].position.set(8.4, -7.2 + index * (0.12 + 0.32), 0)
      tipsGroup.add(tipsMesh[index])
    })
    tipsGroup.visible = false
    tipsGroup.name = 'tips'
    textGroup.rotation.x -= Math.PI * 0.24
    this.scene.add(textGroup)
    this.scene.add(tipsGroup)
  }

  componentDidMount() {
    let camera = new THREE.PerspectiveCamera(75, this.el.clientWidth / this.el.clientHeight, 1, 500)
    this.el.appendChild(this.renderer.domElement)
    camera.position.set(0, 0, 10)
    camera.lookAt(this.scene.position)
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    this.initEarth().initStars().initLight()
    this.initTexts()
    const self = this
    const animation = this.animation = function() {
      window.requestAnimationFrame(animation)
      self.renderer.render(self.scene, camera)
      self.earth.rotation.y += 0.003
      self.earth.rotation.z += 0.0001
      let pos = self.textGroup.position
      // if (pos.y > 0.56 && !self.tipsGroup.visible) {
      //   self.tipsGroup.visible = true
      // }
      self.textGroup.position.set(pos.x, pos.y + 0.003, pos.z - 0.0018)
    }
    animation()
  }

  render() {
    return (<div className="content-wrapper" ref={(el) => this.el = el}/>)
  }
  componentWillUnount() {
    window.cancelAnimationFrame(this.animation)
  }
}
