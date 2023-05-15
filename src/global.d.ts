declare global {
  const Module: {
    HEAPU8: Uint8Array
    _malloc: (n: number) => number
    _free: (ptr: number) => void
    _ttf_to_woff2: (ttf: number, n: number) => number
  }
  let _ptr: number
  let _length: number
  const writeArrayToMemory: (array: Uint8Array, n: number) => void
}

export {}
