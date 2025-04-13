/**
 * Animates a transition from a starting value to an ending value over a specified duration.
 * Calls the provided callback function with the interpolated value at each frame.
 *
 * @param {number} from - The starting value of the animation.
 * @param {number} to - The ending value of the animation.
 * @param {number} duration - The duration of the animation in milliseconds.
 * @param {function} callback - A function that is called with the current value at each frame.
 */

export default function animate(from, to, duration, callback) {
  let start = Date.now()

  const loop = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    callback(from + (to - from) * progress)
    if (progress === 1) return
    requestAnimationFrame(loop)
  }

  loop()
}
