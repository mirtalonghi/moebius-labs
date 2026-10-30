import { useEffect, useState } from 'react'

/** true cuando la página está en modo oscuro (clase "dark" en <html>). */
export function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const html = document.documentElement
    const obs = new MutationObserver(() => setDark(html.classList.contains('dark')))
    obs.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

/** true si la persona pidió reducir el movimiento en su sistema. */
export const prefiereMenosMovimiento = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
