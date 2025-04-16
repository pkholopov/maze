import './style.css'

import * as THREE from 'three'
import { Octree, OctreeHelper, PointerLockControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

import params from './params'
import Movement from './movement'
import animate from './animation'


const clock = new THREE.Clock()


const scene = new THREE.Scene()
scene.background = new THREE.Color(params.background)

if (params.isFog) {
  scene.fog = new THREE.Fog(params.fogColor, params.fogNear, params.fogFar)
}

const camera = new THREE.PerspectiveCamera(params.cameraFov, window.innerWidth / window.innerHeight, params.cameraNear, params.cameraFar)
camera.position.copy(params.cameraPosition)

const renderer = new THREE.WebGLRenderer({ antialias: params.antialias })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


const ambientLight = new THREE.AmbientLight(0xffcccc, 0.01)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffcccc, 0.01)
light.position.set(3, 3, 3)
light.target.position.set(3, 0, 0)
light.castShadow = true
light.shadow.camera.far = 50
light.shadow.camera.near = 0.1
light.shadow.camera.left = -10
light.shadow.camera.right = 10
light.shadow.camera.top = 10
light.shadow.camera.bottom = -10
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
light.shadow.radius = 5
light.shadow.blurSamples = 25
scene.add(light)

const flashLight = new THREE.SpotLight(0xffffdd, 1)
flashLight.position.set(0, 0, 0)
flashLight.angle = Math.PI / 10
flashLight.castShadow = true
flashLight.shadow.camera.far = 50
flashLight.shadow.camera.near = 0.1
flashLight.shadow.camera.left = -10
flashLight.shadow.camera.right = 10
flashLight.shadow.camera.top = 10
flashLight.shadow.camera.bottom = -10
flashLight.shadow.mapSize.width = 1024
flashLight.shadow.mapSize.height = 1024
flashLight.shadow.radius = 5
flashLight.shadow.blurSamples = 25
flashLight.penumbra = 0.9


camera.add(flashLight)
flashLight.position.z = 0.1
scene.add(camera)
flashLight.target = camera

flashLight.visible = false

function toggleFlashLight(event) {
  if (event.code === 'KeyF') {
    flashLight.visible = !flashLight.visible
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const worldGroup = new THREE.Group()
scene.add(worldGroup)

const mazeMap = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 0, 1, 1, 1], 
  [0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 1]
]

for (let i = 0; i < mazeMap.length; i++) {
  for (let j = 0; j < mazeMap[i].length; j++) {
    if (mazeMap[i][j] === 1) {
      const geometry = new THREE.BoxGeometry(1, 7, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.5 })
      const cube = new THREE.Mesh(geometry, material)
      cube.castShadow = true
      cube.receiveShadow = true
      cube.position.set(j, 3, i)
      worldGroup.add(cube)
    }
  }
}

const octree = new Octree()
octree.fromGraphNode(worldGroup)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.5
floor.receiveShadow = true
worldGroup.add(floor)




const player = {
  radius: 0.25,
  position: new THREE.Vector3().copy(camera.position),
  velocity: new THREE.Vector3(0, 0, 0),
  direction: new THREE.Vector3(0, 0, 0),
  speed: 1,
}

const controls = new PointerLockControls(camera, document.body)

document.body.addEventListener('click', () => {
  controls.lock()
})

const movement = new Movement(player, camera, controls, octree)

controls.addEventListener('lock', () => {
  movement.connect()
  document.addEventListener('keydown', toggleFlashLight)
})
controls.addEventListener('unlock', () => {
  movement.disconnect()
  document.removeEventListener('keydown', toggleFlashLight)
})

function tick() {
  const delta = clock.getDelta()
  
  movement.move(delta)
  controls.update(delta)
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(tick)
