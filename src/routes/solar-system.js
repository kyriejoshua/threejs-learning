import React, { Component } from 'react'
import * as THREE from 'three'
import $ from 'jquery'
import Font from './../assets/fonts/helvetiker_regular.typeface.json'
import SunPic from './../assets/sun.jpeg'
import EarthPic from './../assets/earth.jpeg'
import JupiterPic from './../assets/jupiter.jpeg'
import MarsPic from './../assets/mars.jpeg'
import MercuryPic from './../assets/mercury.jpeg'
import NeptunePic from './../assets/neptune.jpeg'
import UranusPic from './../assets/uranus.jpeg'
import VenusPic from './../assets/venus.jpeg'
import SaturnPic from './../assets/saturn.jpeg'

const TexureLoader = new THREE.TextureLoader()
const sunPic = TexureLoader.load(SunPic)
const earthPic = TexureLoader.load(EarthPic)
const jupiterPic = TexureLoader.load(JupiterPic)
const marsPic = TexureLoader.load(MarsPic)
const mercuryPic = TexureLoader.load(MercuryPic)
const neptunePic = TexureLoader.load(NeptunePic)
const uranusPic = TexureLoader.load(UranusPic)
const venusPic = TexureLoader.load(VenusPic)
const saturnPic = TexureLoader.load(SaturnPic)

const P = Math.PI
const planets = [
  {
    name: 'Sun',
    size: [5, 16, 16],
    dis: 0,
    pos: [0, 10, 0],
    color: 0xFFFFFF,
    map: sunPic
  },
  {
    name: 'Mercury',
    size: [0.4, 10, 10],
    dis: 4,
    pos: [0, 10, 9],
    color: 0xFFFFFF,
    map: mercuryPic,
    rev: 0.3,
  },
  {
    name: 'Venus',
    size: [0.85, 10, 10],
    dis: 7.5,
    pos: [0, 10, 12.75],
    color: 0xFFFFFF,
    map: venusPic,
    rev: 0.6,
  },
  {
    name: 'Earth',
    size: [1, 10, 10],
    dis: 10,
    pos: [0, 10, 15],
    color: 0xFFFFFF,
    map: earthPic,
    rev: 1,
  },
  {
    name: 'Mars',
    size: [0.6, 10, 10],
    dis: 15,
    pos: [0, 10, 20],
    color: 0xFFFFFF,
    map: marsPic,
    rev: 1.8,
  },
  {
    name: 'Jupiter',
    size: [4, 32, 32],
    dis:  20,
    pos: [0, 10, 25],
    color: 0xFFFFFF,
    map: jupiterPic,
    rev: 5
  },
  {
    name: 'Saturn',
    size: [3, 32, 32],
    dis:  25,
    pos: [0, 10, 30],
    color: 0xFFFFFF,
    map: saturnPic,
    rev: 10
  },
  {
    name: 'Uranus',
    size: [2, 32, 32],
    dis:  30,
    pos: [0, 10, 35],
    color: 0xFFFFFF,
    map: uranusPic,
    rev: 15
  },
  {
    name: 'Neptune',
    size: [1.8, 32, 32],
    dis:  35,
    pos: [0, 10, 40],
    color: 0xFFFFFF,
    map: neptunePic,
    rev: 0.5
  }
]

const fontStyle = {
  size: 0.6,
  height: 0,
  curveSegments: 12,
  bevelEnabled: false,
  bevelThickness: 1,
  bevelSize: 0.8
}

export default class SolarSystem extends Component {
  constructor(props) {
    super(props)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.font = Object.assign(fontStyle, { font: this.loadFont() })
    this.planetsGroup = new THREE.Group()
    this.textsGroup = new THREE.Group()
    this.tracksGroup = new THREE.Group()
    this.showTitle = false
    // this.renderer = new THREE.WebGLRenderer( parameters )
  }

  getAngle() {
    return (Math.random() * 2 * P).toFixed(2) - 0
  }

  calcSpeed(rev) {
    return rev ? 2 * P / 60 / 60 / rev : 1
  }

  getGroupByName(name) {
    return this[name]
  }

  loadFont() {
    return new THREE.Font(Font)
    // const textloader = new THREE.FontLoader()
    // return new Promise((resolve) => {
      // textloader.load('./assets/fonts/helvetiker_regular.typeface.json', (font) => {
      //   resolve(font)
      // })
    // })
  }

  initText(content) {
    const textGeometry = new THREE.TextGeometry(content, this.font)
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xebebeb })
    return new THREE.Mesh(textGeometry, textMaterial)
  }

  initPlanet(size = [1, 1, 32], color = 0x24bbdf, map, type) {
    const sphereGeometry = new THREE.SphereGeometry(...size)
    const isSun = type === 'Sun'
    const materialType = isSun ? 'MeshPhongMaterial' : 'MeshLambertMaterial'
    const sphereMaterial = isSun ? new THREE[materialType]({ color, map, emissive: 0x9B611F,  }) : new THREE[materialType]({ color, map })
    return new THREE.Mesh(sphereGeometry, sphereMaterial)
  }

  initPlanets() {
    let planetsGroup = this.getGroupByName('planetsGroup')
    let textsGroup = this.getGroupByName('textsGroup')
    textsGroup.name = 'texts'
    planets.map((planetObj) => {
      const planet = this.initPlanet(planetObj.size, planetObj.color, planetObj.map, planetObj.name)
      const speed = this.calcSpeed(planetObj.rev)
      const text = this.initText(planetObj.name)
      Object.assign(planet, {
        name: planetObj.name,
        size: planetObj.size,
        dis: planetObj.pos[2],
        angle: this.getAngle(),
        speed
      })
      planet.position.set(...planetObj.pos)
      text.position.set(...planetObj.pos)
      text.visible = false
      text.name = planetObj.name
      planetsGroup.add(planet)
      textsGroup.add(text)
    })
    return planetsGroup
  }

  handleTrackSize(planet) {
    const outer = planet.pos[2]
    const inner = outer - 0.1
    return [outer, inner, 100]
  }

  initTrack(size, color = 0x453830) {
    const ringGeometry = new THREE.RingGeometry(...size)
    const ringMaterial = new THREE.MeshBasicMaterial({ color, opacity: 0.1 })
    return new THREE.Mesh(ringGeometry, ringMaterial)
  }

  initTracks() {
    let tracksGroup = this.getGroupByName('tracksGroup')
    planets.map((planet) => {
      if (planet.name === 'Sun') { return }
      const size = this.handleTrackSize(planet)
      const track = this.initTrack(size)
      track.rotation.x = 0.5 * P
      track.position.set(0, 10, 0)
      track.name = name
      tracksGroup.add(track)
    })
    return tracksGroup
  }

  initPointLight() {
    const Sun = planets[0]
    let pointLight = new THREE.PointLight(Sun.color, 1, 100)
    pointLight.position.set(...Sun.pos)
    return pointLight
  }

  initAmbientLight(color = 0xFEFFFF, intensity = 0.7) {
    return new THREE.AmbientLight(color, intensity)
  }

  revolution(planetsGroup, textsGroup) {
    if (!Array.isArray(planetsGroup.children)) {
      return
    }
    planetsGroup.children.map((planet, index) => {
      const { angle, speed, dis } = planet
      const text = textsGroup.children[index]
      const r = text && text.geometry && text.geometry.boundingSphere && text.geometry.boundingSphere.radius || 0
      planet.position.set(Math.sin(angle) * dis, 10, Math.cos(angle) * dis)
      planet.rotation.y += 0.002
      text.position.set(Math.sin(angle) * dis - r, 10 + 0.5 + planet.size[0], Math.cos(angle) * dis + 0.5)
      planet.angle += planet.speed
    })
  }

  onDomMouseMove(event) {
    event.stopPropagation()
    event.preventDefault()
    this.mouse.x = (event.clientX - this.$el.offset().left - this.$el.width() / 2) / (this.$el.width() / 2)
    this.mouse.y = - (event.clientY - this.$el.height() / 2) / (this.$el.height() / 2)
    this.handleRaycaster()
  }

  handleRaycaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh && intersects[0].object.name) {
      const name = intersects[0].object.name
      this.handleText(name, true)
    } else {
      this.showTitle && this.handleText(null, false)
    }
  }

  /**
   * [handleText description]
   * @param  {String} name [description]
   * @param  {Boolean} bol  [description]
   */
  handleText(name, bol) {
    this.scene.children.map((obj) => {
      if (obj.name !== 'texts') { return }
      obj.children.map((text) => {
        text.visible = name === text.name
      })
      this.showTitle = bol
    })
  }

  componentDidMount() {
    this.$el = $(this.el)
    this.el.addEventListener('mousemove', this.onDomMouseMove.bind(this))
    const planetsGroup = this.initPlanets()
    const tracksGroup = this.initTracks()
    const pointLight = this.initPointLight()
    const ambientLight = this.initAmbientLight()
    this.scene.add(planetsGroup)
    this.scene.add(tracksGroup)
    this.scene.add(pointLight)
    this.scene.add(ambientLight)
    this.scene.add(this.textsGroup)
    this.el.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    // bigger fov will cause excessive perspective 75 => 45
    this.camera = new THREE.PerspectiveCamera(45, this.el.clientWidth / this.el.clientHeight, 1, 500)
    this.camera.position.set(0, 30, 70)
    this.camera.lookAt(this.scene.position)
    this.animate = () => {
      this.animation = window.requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      this.revolution(planetsGroup, this.textsGroup)
    }

    this.animate()
  }

  render() {
    return <div className="content-wrapper" ref={(el) => this.el = el}/>
  }

  componentWillUnount() {
    window.cancelAnimationFrame(this.animation)
  }
}
