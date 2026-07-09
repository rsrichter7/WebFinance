// ─── Cache manager ───
// Registreer clear-functies per hook. Bij uitloggen worden alle caches in één keer gewist.

const clearFns = []

export function registerCache(clearFn) {
  if (!clearFns.includes(clearFn)) clearFns.push(clearFn)
}

export function clearAllCaches() {
  clearFns.forEach(fn => fn())
}

const listeners = {}

export function subscribe(event, fn) {
  if (!listeners[event]) listeners[event] = []
  listeners[event].push(fn)
  return () => { listeners[event] = (listeners[event] || []).filter(f => f !== fn) }
}

export function emit(event) {
  (listeners[event] || []).forEach(fn => { try { fn() } catch (e) { /* stil */ } })
}
