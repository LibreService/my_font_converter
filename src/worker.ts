import { loadWasm, expose, control } from '@libreservice/my-worker'

const readyPromise = loadWasm('woff2.js', {
  url: '__LIBRESERVICE_CDN__'
})

// @ts-ignore
globalThis._ptr = globalThis._length = 0
// @ts-ignore
globalThis._progress = control('progress')

function makeConverter (cFunc: (buffer: number, n: number) => number) {
  return (buffer: ArrayBuffer): number => {
    const addr = Module._malloc(buffer.byteLength)
    if (!addr) {
      throw new Error('OOM')
    }
    writeArrayToMemory(new Uint8Array(buffer), addr)
    _length = cFunc(addr, buffer.byteLength)
    Module._free(addr)
    return _length
  }
}

expose({
  ttfToWoff2: makeConverter(Module._ttf_to_woff2),
  woff2ToTtf: makeConverter(Module._woff2_to_ttf),
  getFile (content: ArrayBuffer) {
    if (!_ptr) {
      throw new Error('NPE')
    }
    new Uint8Array(content).set(new Uint8Array(Module.HEAPU8.buffer, _ptr, _length))
    Module._free(_ptr)
    _ptr = 0
  }
}, readyPromise)
