import { Page, Locator, expect } from '@playwright/test'

const baseURL = 'http://localhost:4173/'
const dejaVuDir = 'dejavu-fonts-ttf-2.37/'

async function upload (page: Page, locator: Locator, files: string[]) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    locator.click()
  ])
  return fileChooser.setFiles(files.map(file => dejaVuDir + file))
}

function convert (page: Page) {
  return page.locator('.n-button').getByText('Convert').click()
}

function expectFinished (page: Page, name: string) {
  return expect(page.getByText(`${name} ✅`)).toBeVisible({ timeout: 30000 })
}

function expectFailed (page: Page, name: string) {
  return expect(page.locator('.n-upload-file--error-status').getByText(name)).toBeVisible()
}

async function expectDownload (page: Page, locator: Locator, length: number) {
  const downloadPromise = page.waitForEvent('download')
  await locator.click()
  const download = await downloadPromise
  const readable = (await download.createReadStream())!
  return new Promise(resolve => readable!.on('data', content => {
    expect(content).toHaveLength(length)
    resolve(null)
  }))
}

export {
  baseURL,
  upload,
  convert,
  expectFinished,
  expectFailed,
  expectDownload
}
