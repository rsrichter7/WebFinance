// ─── Cache manager ───
// Registreer clear-functies per hook. Bij uitloggen worden alle caches in één keer gewist.

const clearFns = []

export function registerCache(clearFn) {
  if (!clearFns.includes(clearFn)) clearFns.push(clearFn)
}

export function clearAllCaches() {
  clearFns.forEach(fn => fn())
}
