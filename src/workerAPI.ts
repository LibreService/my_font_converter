import { LambdaWorker, RentedBuffer } from '@libreservice/my-worker'

const worker = new LambdaWorker('./worker.js')

const _ttfToWoff2: (ttf: RentedBuffer) => Promise<number> = worker.register('ttfToWoff2')
const getFile: (content: RentedBuffer) => Promise<void> = worker.register('getFile')

let progressCallback: (percentage: number) => void

function registerProgressCallback (callback: (percentage: number) => void) {
  progressCallback = callback
}

worker.control('progress', (percentage: number) => progressCallback(percentage))

async function ttfToWoff2 (ttf: ArrayBuffer) {
  const n = await _ttfToWoff2(new RentedBuffer(ttf))
  const buffer = new ArrayBuffer(n)
  if (n === 0) {
    return buffer
  }
  const woff2 = new RentedBuffer(buffer)
  await getFile(woff2)
  return woff2.buffer
}

export {
  registerProgressCallback,
  ttfToWoff2
}
