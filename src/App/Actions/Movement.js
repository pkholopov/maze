import { EventDispatcher, Sphere} from 'three'
import App from '../App'

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

export default class Movement extends EventDispatcher {
  /**
   * Constructor for Movement class.
   * @param {object} movableObject - Player object, that can be moved.
   * @param {THREE.PerspectiveCamera} camera - Camera object.
   * @param {PointerLockControls} controls - PointerLockControls object.
   * @param {Octree} octree - Octree object.
   */
  constructor(movableObject) {
    super()
    this.app = new App();
    this.movableObject = movableObject
    this.camera = movableObject.cameraInstance
    this.controls = movableObject.controls
    this.octree = this.app.world.octree
    this.boundOnKeyDown = this.onKeyDown.bind(this)
    this.boundOnKeyUp = this.onKeyUp.bind(this)
    console.log(this);
    
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
    const boundingSphere = new Sphere(this.movableObject.position, this.movableObject.size)
    const result = this.octree.sphereIntersect(boundingSphere)
    if (result && result.depth > 0.00001) {
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
    this.movableObject.direction.multiplyScalar(speed * delta)
    this.controls.moveRight(this.movableObject.direction.x)
    this.controls.moveForward(this.movableObject.direction.z)
    this.movableObject.position.copy(this.camera.position)
    
    this.collisionDetection()
    if (moves.forward || moves.backward || moves.left || moves.right) {
      this.dispatchEvent({
        type: 'move'
      })
    } else {
      this.dispatchEvent({
        type: 'stop'
      })
    }
  }
}
