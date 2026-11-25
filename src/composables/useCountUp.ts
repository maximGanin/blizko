import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export function useCountUp(source: Ref<number>, duration = 520) {
  const displayed = ref(source.value)
  let frame = 0

  watch(source, (target) => {
    if (typeof window === 'undefined') {
      displayed.value = target
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayed.value = target
      return
    }
    const start = displayed.value
    const startedAt = performance.now()
    cancelAnimationFrame(frame)

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      displayed.value = start + (target - start) * eased
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return displayed
}
