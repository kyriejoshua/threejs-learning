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
    size: [0.2, 10, 10],
    dis: 4,
    pos: [0, 10, 9],
    revolution: 0.3
  },
  Venus: {
    size: [0.85, 10, 10],
    dis: 7.5,
    pos: [0, 10, 12.75],
    revolution: 0.6
  },
  Earth: {
    size: [1, 10, 10],
    dis: 10,
    pos: [0, 10, 15],
    revolution: 1
  },
  Mars: {
    size: [0.5, 10, 10],
    dis: 15,
    pos: [0, 10, 20],
    revolution: 1.8,
  },
  Jupiter: {
    size: [4, 32, 32],
    dis:  20,
    pos: [0, 10, 25],
    revolution: 5
  },
  Saturn: {
    size: [3, 32, 32],
    dis:  25,
    pos: [0, 10, 30],
    revolution: 10
  },
  Uranus: {
    size: [2, 32, 32],
    dis:  30,
    pos: [0, 10, 35],
    revolution: 15
  },
  Neptune: {
    size: [1.8, 32, 32],
    dis:  35,
    pos: [0, 10, 40],
    revolution: 0.45
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
    return planet.revolution ? 2 * P / 60 / 60 / planet.revolution : 1
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
    this.scene.add(planetsGroup)
    this.el.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
    this.camera = new THREE.PerspectiveCamera(120, this.el.clientWidth / this.el.clientHeight, 1, 100)
    this.camera.position.set(0, 30, 45)
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
