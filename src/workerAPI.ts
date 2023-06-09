import { LambdaWorker, RentedBuffer } from '@libreservice/my-worker'

function makeConverter (name: string, extension: string) {
  let progressCallback: (percentage: number) => void
  const worker = new LambdaWorker('./worker.js')

  const helper: (rBuf: RentedBuffer) => Promise<number> = worker.register(name)
  const getFile: (content: RentedBuffer) => Promise<void> = worker.register('getFile')
  worker.control('progress', (percentage: number) => progressCallback(percentage))

  return {
    registerProgressCallback (callback: (percentage: number) => void) {
      progressCallback = callback
    },
    convertName (name: string) {
      const i = name.lastIndexOf('.')
      return (i >= 0 ? name.slice(0, i) : name) + '.' + extension
    },
    async convert (buffer: ArrayBuffer) {
      const n = await helper(new RentedBuffer(buffer))
      const result = new ArrayBuffer(n)
      if (n === 0) {
        return result
      }
      const woff2 = new RentedBuffer(result)
      await getFile(woff2)
      return woff2.buffer
    }
  }
}

const ttfToWoff2 = makeConverter('ttfToWoff2', 'woff2')
const woff2ToTtf = makeConverter('woff2ToTtf', 'ttf')

export {
  ttfToWoff2,
  woff2ToTtf
}
