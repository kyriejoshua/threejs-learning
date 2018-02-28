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
import StarPic from './../assets/star.png'

const TextureLoader = new THREE.TextureLoader()
const sunPic = TextureLoader.load(SunPic)
const earthPic = TextureLoader.load(EarthPic)
const jupiterPic = TextureLoader.load(JupiterPic)
const marsPic = TextureLoader.load(MarsPic)
const mercuryPic = TextureLoader.load(MercuryPic)
const neptunePic = TextureLoader.load(NeptunePic)
const uranusPic = TextureLoader.load(UranusPic)
const venusPic = TextureLoader.load(VenusPic)
const saturnPic = TextureLoader.load(SaturnPic)
const starPic = TextureLoader.load(StarPic)

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
    hasRing: true,
    rev: 10
  },
  {
    name: 'Uranus',
    size: [2, 32, 32],
    dis:  30,
    pos: [0, 10, 36],
    color: 0xFFFFFF,
    map: uranusPic,
    rev: 15
  },
  {
    name: 'Neptune',
    size: [1.8, 32, 32],
    dis:  35,
    pos: [0, 10, 45],
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

  initStars() {
    const textureStar = TextureLoader.load(StarPic)
    let starsGeometry = new THREE.Geometry()
    for ( let i = 0; i < 250; i++ ) {
      let star = new THREE.Vector3()
      star.x = THREE.Math.randFloatSpread(100)
      star.y = THREE.Math.randFloatSpread(100)
      star.z = THREE.Math.randFloatSpread(100)
      starsGeometry.vertices.push(star)
    }
    const starsMaterial = new THREE.PointsMaterial({ color: 0xcfee90, map: textureStar, size: 1,
      transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthTest: false })
    const starField = new THREE.Points(starsGeometry, starsMaterial)
    starField.clockwise = true
    starField.position.set(0, 10, 0)
    this.scene.add(starField)
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
      const { pos, size, color, map, name, rev, hasRing = false } = planetObj
      const planet = this.initPlanet(size, color, map, name)
      const speed = this.calcSpeed(rev)
      const text = this.initText(name)
      Object.assign(planet, {
        name,
        size,
        dis: pos[2],
        angle: this.getAngle(),
        speed
      })
      planet.position.set(...pos)
      text.position.set(...pos)
      text.visible = false
      text.name = name
      planetsGroup.add(planet)
      textsGroup.add(text)
    })
    return planetsGroup
  }

  handleTrackSize(outer, size = 0.15) {
    const inner = outer - size
    return [outer, inner, 100]
  }

  createTrackMesh(size, color = 0x453830, map) {
    const ringGeometry = new THREE.RingGeometry(...size)
    const ringMaterial = new THREE.MeshLambertMaterial({ color, map })
    return new THREE.Mesh(ringGeometry, ringMaterial)
  }

  createTrack(outer, size, color, map) {
    return this.createTrackMesh(this.handleTrackSize(outer, size), color, map)
  }

  initTrack(planet, isRing) {
    const { size, pos, name, map } = planet
    const outer = isRing ? size[0] + 2: pos[2]
    const position = isRing ? pos : [0, 10, 0]
    const trackSize = isRing ? 1 : 0.15
    const trackColor = isRing ? 0xFFFFFF : 0x453830
    // const trackColor = isRing ? 0xAC8B61 : 0x453830
    const trackMap = isRing ? map : null
    const track = this.createTrack(outer, trackSize, trackColor, trackMap)
    track.rotation.x = isRing ? 0.6 * P : 0.5 * P
    track.rotation.y = isRing ? 0.1 * P : 0
    track.rotation.z = isRing ? 0.2 * P : 0
    track.position.set(...position)
    track.name = isRing ? name : ''
    return track
  }

  initTracks() {
    let tracksGroup = this.getGroupByName('tracksGroup')
    planets.map((planet) => {
      if (planet.name === 'Sun') { return }
      const track = this.initTrack(planet)
      tracksGroup.add(track)
      if (planet.hasRing) {
        const ring = this.initTrack(planet, true)
        tracksGroup.add(ring)
      }
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

  revolution(planetsGroup, textsGroup, tracksGroup, scene) {
    if (!Array.isArray(planetsGroup.children)) {
      return
    }
    planetsGroup.children.map((planet, index) => {
      const { angle, speed, dis } = planet
      const text = textsGroup.children[index]
      const r = text && text.geometry && text.geometry.boundingSphere && text.geometry.boundingSphere.radius || 0
      const planetPos = [Math.sin(angle) * dis, 10, Math.cos(angle) * dis]
      const textPos = [Math.sin(angle) * dis - r, 10 + 0.5 + planet.size[0], Math.cos(angle) * dis + 0.5]
      planet.position.set(...planetPos)
      if (planet.name === 'Saturn') {
        tracksGroup.children.map((track) => {
          track.name === 'Saturn' && track.position.set(...planetPos)
        })
      }
      planet.rotation.y += 0.002
      text.position.set(...textPos)
      planet.angle += planet.speed
    })
    scene && Array.isArray(scene.children) && scene.children.map((obj, i) => {
      if (obj instanceof THREE.Points) {
        const time = Date.now() * 0.00001
        obj.rotation.y = time * ( obj.clockwise ? i + 0.1 : -( i + 0.1 ) )
      }
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
    const starField = this.initStars()
    this.scene.add(planetsGroup)
    this.scene.add(tracksGroup)
    this.scene.add(pointLight)
    this.scene.add(ambientLight)
    this.scene.add(this.textsGroup)
    this.scene.add(starField)
    this.el.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    // bigger fov will cause excessive perspective 75 => 45
    this.camera = new THREE.PerspectiveCamera(45, this.el.clientWidth / this.el.clientHeight, 1, 500)
    this.camera.position.set(0, 30, 70)
    this.camera.lookAt(this.scene.position)
    this.animate = () => {
      this.animation = window.requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      this.revolution(planetsGroup, this.textsGroup, tracksGroup, this.scene)
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
