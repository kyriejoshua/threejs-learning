import React, { Component } from 'react'
import * as THREE from 'three'
import Font from './../assets/fonts/helvetiker_regular.typeface.json'

const P = Math.PI
const planets = [
  {
    name: 'Sun',
    size: [5, 16, 16],
    dis: 0,
    pos: [0, 10, 0],
    color: 0xFEF778
  },
  {
    name: 'Mercury',
    size: [0.4, 10, 10],
    dis: 4,
    pos: [0, 10, 9],
    color: 0xFA9E05,
    rev: 0.3
  },
  {
    name: 'Venus',
    size: [0.85, 10, 10],
    dis: 7.5,
    pos: [0, 10, 12.75],
    color: 0xFFDD00,
    rev: 0.6
  },
  {
    name: 'Earth',
    size: [1, 10, 10],
    dis: 10,
    pos: [0, 10, 15],
    color: 0x00B7C2,
    rev: 1
  },
  {
    name: 'Mars',
    size: [0.6, 10, 10],
    dis: 15,
    pos: [0, 10, 20],
    color: 0xBC5148,
    rev: 1.8,
  },
  {
    name: 'Jupiter',
    size: [4, 32, 32],
    dis:  20,
    pos: [0, 10, 25],
    color: 0xF0D879,
    rev: 5
  },
  {
    name: 'Saturn',
    size: [3, 32, 32],
    dis:  25,
    pos: [0, 10, 30],
    color: 0xF4D143,
    rev: 10
  },
  {
    name: 'Uranus',
    size: [2, 32, 32],
    dis:  30,
    pos: [0, 10, 35],
    color: 0x48BA95,
    rev: 15
  },
  {
    name: 'Neptune',
    size: [1.8, 32, 32],
    dis:  35,
    pos: [0, 10, 40],
    color: 0xEAC100,
    rev: 0.5
  }
]

const fontStyle = {
  size: 0.5,
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
    this.font = Object.assign(fontStyle, { font: this.loadFont() })
    this.planetsGroup = new THREE.Group()
    this.textsGroup = new THREE.Group()
    this.tracksGroup = new THREE.Group()
    // this.renderer = new THREE.WebGLRenderer( parameters )
  }

  getAngle() {
    return (Math.random() * 2 * P).toFixed(2) - 0
  }

  calcSpeed(planet) {
    return planet.rev ? 2 * P / 60 / 60 / planet.rev : 1
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

  initPlanet(size = [1, 1, 32], color = 0x24bbdf, type) {
    const sphereGeometry = new THREE.SphereGeometry(...size)
    const materialType = type === 'Sun' ? 'MeshPhongMaterial' : 'MeshLambertMaterial'
    const sphereMaterial = new THREE[materialType]({ color })
    return new THREE.Mesh(sphereGeometry, sphereMaterial)
  }

  initPlanets() {
    let planetsGroup = this.getGroupByName('planetsGroup')
    let textsGroup = this.getGroupByName('textsGroup')
    planets.map((planetObj) => {
      const planet = this.initPlanet(planetObj.size, planetObj.color, planetObj.name)
      const speed = this.calcSpeed(planetObj)
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
      planetsGroup.add(planet)
      textsGroup.add(text)
    })
    return planetsGroup
  }

  handleTrackSize(planet) {
    const outer = planet.pos[2]
    const inner = outer - 0.05
    return [outer, inner, 100]
  }

  initTrack(size, color = 0xfeffff) {
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
      const r = text && text.geometry && text.geometry.boundingSphere.radius || 0
      planet.position.set(Math.sin(angle) * dis, 10, Math.cos(angle) * dis)
      text.position.set(Math.sin(angle) * dis - r, 10 + 0.5 + planet.size[0], Math.cos(angle) * dis + 0.5)
      planet.angle += planet.speed
    })
  }

  componentDidMount() {
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
