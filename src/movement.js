import * as THREE from 'three'

const keys = {
  'KeyW': 'forward',
  'KeyS': 'backward',
  'KeyA': 'left',
  'KeyD': 'right',
  'ShiftLeft': 'run'
}

const moves = {
  'forward': false,
  'backward': false,
  'left': false,
  'right': false,
  'run': false
}

export default class Movement {
  /**
   * Constructor for Movement class.
   * @param {object} movableObject - Player object, that can be moved.
   * @param {THREE.PerspectiveCamera} camera - Camera object.
   * @param {PointerLockControls} controls - PointerLockControls object.
   * @param {Octree} octree - Octree object.
   */
  constructor(movableObject, camera, controls, octree) {
    this.movableObject = movableObject
    this.camera = camera
    this.controls = controls
    this.octree = octree
    this.boundOnKeyDown = this.onKeyDown.bind(this)
    this.boundOnKeyUp = this.onKeyUp.bind(this)    
  }

  onKeyDown(e) {
    if (keys[e.code]) {
      moves[keys[e.code]] = true
    }
  }

  onKeyUp(e) {
    if (keys[e.code]) {
      moves[keys[e.code]] = false
    }
  }

  connect() {
    this.controls.domElement.addEventListener('keydown', this.boundOnKeyDown)
    this.controls.domElement.addEventListener('keyup', this.boundOnKeyUp)
  }

  disconnect() {
    this.controls.domElement.removeEventListener('keydown', this.boundOnKeyDown)
    this.controls.domElement.removeEventListener('keyup', this.boundOnKeyUp)
  }

  collisionDetection() {
    const boundingSphere = new THREE.Sphere(this.movableObject.position, this.movableObject.radius)
    const result = this.octree.sphereIntersect(boundingSphere)
    if (result && result.depth > 0.00001) {
      console.log(result);
      result.normal.y = 0 //FIXME: костыль, чтобы не уползать под пол
      
      this.camera.position.add( result.normal.multiplyScalar( result.depth ) );
      this.movableObject.position.copy(this.camera.position)
    }
    
  }
  
  move(delta) {    
    let speed = this.movableObject.speed
    if (moves.run) {
      speed += 1.5 
    }
    this.movableObject.direction.x = Number(moves.right) - Number(moves.left)
    this.movableObject.direction.z = Number(moves.forward) - Number(moves.backward)
    this.movableObject.direction.normalize()

    if (moves.forward || moves.backward) {
      this.movableObject.velocity.z = this.movableObject.direction.z
    } else {
      this.movableObject.velocity.z = 0
    }

    if (moves.left || moves.right) {
      this.movableObject.velocity.x = this.movableObject.direction.x
    } else {
      this.movableObject.velocity.x = 0
    }
    this.movableObject.velocity.multiplyScalar(speed * delta)
    this.controls.moveRight(this.movableObject.velocity.x)
    this.controls.moveForward(this.movableObject.velocity.z)
    this.movableObject.position.copy(this.camera.position)
    this.collisionDetection()
  }
}
