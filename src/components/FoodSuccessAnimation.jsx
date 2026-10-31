import { motion, useReducedMotion } from 'framer-motion'
import './FoodSuccessAnimation.css'

const confetti = [
  ['circle', -56, -42, '#ff5a00'], ['square', -35, -62, '#ff9a55'], ['triangle', -8, -68, '#ffc107'],
  ['streamer', 25, -61, '#ff5a00'], ['circle', 53, -39, '#ff9a55'], ['square', 66, -8, '#ffc107'],
  ['triangle', 59, 30, '#ff5a00'], ['circle', 32, 54, '#ff9a55'], ['streamer', -4, 64, '#ffc107'],
  ['square', -40, 52, '#ff5a00'], ['circle', -62, 22, '#ff9a55'], ['triangle', -65, -13, '#ffc107'],
]

export default function FoodSuccessAnimation({ orderId }) {
  const reduceMotion = useReducedMotion()
  if (!orderId) return null

  return <div className="order-success-animation" role="status" aria-label="Order successfully placed">
    <motion.span className="order-success-ripple order-success-ripple-outer" aria-hidden="true" initial={{ opacity: 0, scale: .58 }} animate={{ opacity: [0, .5, 0], scale: [reduceMotion ? 1 : .58, 1.45] }} transition={{ duration: reduceMotion ? 0 : .95, ease: 'easeOut' }} />
    <motion.span className="order-success-ripple order-success-ripple-inner" aria-hidden="true" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: [0, .28, 0], scale: [reduceMotion ? 1 : .72, 1.23] }} transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .1, ease: 'easeOut' }} />
    {confetti.map(([shape, x, y, color], index) => <motion.span key={index} className={`order-success-confetti confetti-${shape}`} aria-hidden="true" style={{ '--confetti-color': color }} initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: .2 }} animate={{ opacity: [0, 1, 0], x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y, rotate: reduceMotion ? 0 : (index % 2 ? 130 : -130), scale: reduceMotion ? 0 : [0, 1, .65] }} transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : .35 + index % 4 * .025, ease: 'easeOut' }} />)}
    <svg className="order-success-progress-ring" viewBox="0 0 108 108" aria-hidden="true"><motion.circle cx="54" cy="54" r="49" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : .78, ease: 'easeInOut' }} /></svg>
    <motion.span className="order-success-check-circle" aria-hidden="true" initial={{ scale: reduceMotion ? 1 : .65, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : .08, type: 'spring', stiffness: 250, damping: 17 }}>
      <svg viewBox="0 0 48 48"><motion.path d="m10 25 9 9 19-21" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : .48, delay: reduceMotion ? 0 : .78, ease: 'easeOut' }} /></svg>
    </motion.span>
  </div>
}
