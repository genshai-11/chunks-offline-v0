import '@testing-library/jest-dom/vitest'

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })
}

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: () => new Proxy(
    {
      measureText: (text: string) => ({ width: text.length * 8 }),
    },
    {
      get(target, prop) {
        if (prop in target) return target[prop as keyof typeof target]
        return () => undefined
      },
      set() {
        return true
      },
    },
  ),
})
