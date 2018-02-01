import React, { Component } from 'react'
import * as THREE from 'three'

const P = Math.PI
const planetsName = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']
const planets = {
  Sun: {
    size: [5, 16, 16],
    dis: 0,
    pos: [0, 10, 0],
    color: 0xfef778
  },
  Mercury: {
    size: [0.4, 10, 10],
    dis: 4,
    pos: [0, 10, 9],
    rev: 0.3
  },
  Venus: {
    size: [0.85, 10, 10],
    dis: 7.5,
    pos: [0, 10, 12.75],
    rev: 0.6
  },
  Earth: {
    size: [1, 10, 10],
    dis: 10,
    pos: [0, 10, 15],
    rev: 1
  },
  Mars: {
    size: [0.6, 10, 10],
    dis: 15,
    pos: [0, 10, 20],
    rev: 1.8,
  },
  Jupiter: {
    size: [4, 32, 32],
    dis:  20,
    pos: [0, 10, 25],
    rev: 5
  },
  Saturn: {
    size: [3, 32, 32],
    dis:  25,
    pos: [0, 10, 30],
    rev: 10
  },
  Uranus: {
    size: [2, 32, 32],
    dis:  30,
    pos: [0, 10, 35],
    rev: 15
  },
  Neptune: {
    size: [1.8, 32, 32],
    dis:  35,
    pos: [0, 10, 40],
    rev: 0.5
  }
}

export default class SolarSystem extends Component {
  constructor(props) {
    super(props)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    // this.renderer = new THREE.WebGLRenderer( parameters )
  }

  getAngle() {
    return (Math.random() * 2 * P).toFixed(2) - 0
  }

  calcSpeed(planet) {
    return planet.rev ? 2 * P / 60 / 60 / planet.rev : 1
  }

  initPlanet(size = [1, 1, 32], color = 0x24bbdf) {
    const sphereGeometry = new THREE.SphereGeometry(...size)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color })
    // const sphereMaterial = THREE.MeshBasicMaterial( color, map, shading, wireframe )
    return new THREE.Mesh(sphereGeometry, sphereMaterial)
  }

  initPlanets() {
    const planetsGroup = new THREE.Group()
    planetsName.map((name) => {
      const planetObj = planets[name]
      const planet = this.initPlanet(planetObj.size, planetObj.color)
      const speed = this.calcSpeed(planetObj)
      planet.speed = speed
      planet.dis = planetObj.pos[2]
      planet.angle = this.getAngle()
      planet.position.set(...planets[name].pos)
      planetsGroup.add(planet)
    })
    return planetsGroup
  }

  initTrack(size, color = 0xfeffff) {
    const ringGeometry = new THREE.RingGeometry(...size)
    const ringMaterial = new THREE.MeshBasicMaterial({ color, opacity: 0.1 })
    return new THREE.Mesh(ringGeometry, ringMaterial)
  }

  initTracks() {
    const tracksGroup = new THREE.Group()
    planetsName.map((name) => {
      if (name === 'Sun') { return }
      const outer = planets[name].pos[2]
      const inner = outer - 0.05
      const size = [outer, inner, 100]
      const track = this.initTrack(size)
      track.rotation.x = 0.5 * P
      track.position.set(0, 10, 0)
      track.name = name
      tracksGroup.add(track)
    })
    return tracksGroup
  }

  revolution(planetsGroup) {
    if (!Array.isArray(planetsGroup.children)) {
      return
    }
    planetsGroup.children.map((planet) => {
      const { angle, speed, dis } = planet
      planet.position.set(Math.sin(angle) * dis, 10, Math.cos(angle) * dis)
      planet.angle += planet.speed
    })
  }

  componentDidMount() {
    const planetsGroup = this.initPlanets()
    const tracksGroup = this.initTracks()
    this.scene.add(planetsGroup)
    this.scene.add(tracksGroup)
    this.el.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    // bigger fov will cause excessive perspective 75 => 45
    this.camera = new THREE.PerspectiveCamera(45, this.el.clientWidth / this.el.clientHeight, 1, 500)
    this.camera.position.set(0, 30, 70)
    this.camera.lookAt(this.scene.position)
    this.animate = () => {
      this.animation = window.requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      this.revolution(planetsGroup)
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
