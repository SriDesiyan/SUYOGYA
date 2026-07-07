import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery'

interface CountUpOptions {
  duration?: number
  start?: number
  /** Only begin when this becomes true (e.g. in-view). */
  enabled?: boolean
  decimals?: number
}

/**
 * Animated number counter using requestAnimationFrame with an eased curve.
 * Respects prefers-reduced-motion by snapping to the final value.
 */
export function useCountUp(
  target: number,
  { duration = 1400, start = 0, enabled = true, decimals = 0 }: CountUpOptions = {},
) {
  const [value, setValue] = useState(start)
  const reduced = usePrefersReducedMotion()
  const frame = useRef<number>()

  useEffect(() => {
    if (!enabled) return
    if (reduced) {
      setValue(target)
      return
    }
    const startTime = performance.now()
    const from = start
    const delta = target - from

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const next = from + delta * eased
      setValue(Number(next.toFixed(decimals)))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, enabled, reduced])

  return value
}
