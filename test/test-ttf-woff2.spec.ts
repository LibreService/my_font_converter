import { test } from '@playwright/test'
import {
  baseURL,
  upload,
  convert,
  expectFinished,
  expectFailed,
  expectDownload
} from './util'

test('TTF to WOFF2', async ({ page }) => {
  await page.goto(baseURL)

  await upload(page, page.getByText('Click, or drag ttf files to this area'), [
    'ttf/DejaVuSansMono-Oblique.ttf',
    'LICENSE',
    'ttf/DejaVuSansMono-BoldOblique.ttf'
  ])
  await convert(page)
  await expectFinished(page, 'DejaVuSansMono-Oblique.woff2')
  const item = page.locator('.n-upload-file:nth-child(1)')
  await item.hover()
  await expectDownload(page, item.locator('button:nth-child(2)'), 107524)

  await expectFailed(page, 'LICENSE')
  await expectFinished(page, 'DejaVuSansMono-BoldOblique.woff2')

  await expectDownload(page, page.getByText('Download all'), 216078)
})
