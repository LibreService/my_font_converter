import { loadWasm, expose, control } from '@libreservice/my-worker'

const readyPromise = loadWasm('woff2.js', {
  url: '__LIBRESERVICE_CDN__'
})

// @ts-ignore
globalThis._ptr = globalThis._length = 0
// @ts-ignore
globalThis._progress = control('progress')

expose({
  ttfToWoff2 (ttf: ArrayBuffer): number {
    const addr = Module._malloc(ttf.byteLength)
    if (!addr) {
      throw new Error('OOM')
    }
    writeArrayToMemory(new Uint8Array(ttf), addr)
    _length = Module._ttf_to_woff2(addr, ttf.byteLength)
    Module._free(addr)
    return _length
  },
  getFile (content: ArrayBuffer) {
    if (!_ptr) {
      throw new Error('NPE')
    }
    new Uint8Array(content).set(new Uint8Array(Module.HEAPU8.buffer, _ptr, _length))
    Module._free(_ptr)
    _ptr = 0
  }
}, readyPromise)
