import { Page, Locator, expect } from '@playwright/test'

const baseURL = 'http://localhost:4173/'
const dejaVuDir = 'dejavu-fonts-ttf-2.37/'

async function upload (page: Page, locator: Locator, files: string[] | {
  name: string,
  mimeType: string,
  buffer: Buffer
}) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    locator.click()
  ])
  return fileChooser.setFiles(Array.isArray(files) ? files.map(file => dejaVuDir + file) : files)
}

function convert (page: Page, n: number) {
  return page.locator('.n-button').getByText('Convert').nth(n).click()
}

function expectFinished (page: Page, name: string) {
  return expect(page.getByText(`${name} ✅`)).toBeVisible({ timeout: 30000 })
}

function expectFailed (page: Page, name: string) {
  return expect(page.locator('.n-upload-file--error-status').getByText(name)).toBeVisible()
}

async function download (page: Page, locator: Locator) {
  const downloadPromise = page.waitForEvent('download')
  await locator.click()
  const download = await downloadPromise
  const readable = (await download.createReadStream())!
  return new Promise<Uint8Array>(resolve => readable!.on('data', (content: Uint8Array) => {
    resolve(content)
  }))
}

export {
  baseURL,
  upload,
  convert,
  expectFinished,
  expectFailed,
  download
}
