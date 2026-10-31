import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

export default function AnimatedCounter({ value, prefix = '', suffix = '', locale = 'en-IN', minWidthCh = 3 }) {
  const target = Number(value) || 0
  const prefersReducedMotion = useReducedMotion()
  const count = useMotionValue(prefersReducedMotion ? target : 0)
  const formattedCount = useTransform(count, (latest) => Math.round(latest).toLocaleString(locale))

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(target)
      return undefined
    }
    const controls = animate(count, target, { duration: 1.5, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, prefersReducedMotion, target])

  return <motion.span
    aria-label={`${prefix}${target.toLocaleString(locale)}${suffix}`}
    aria-live="off"
    style={{ display: 'inline-block', minWidth: `${minWidthCh}ch`, fontVariantNumeric: 'tabular-nums' }}
  >{prefix}<motion.span aria-hidden="true">{formattedCount}</motion.span>{suffix}</motion.span>
}
