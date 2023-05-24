import { expect, test } from '@playwright/test'
import {
  baseURL,
  upload,
  convert,
  expectFinished,
  expectFailed,
  download
} from './util'

test('TTF to WOFF2', async ({ page }) => {
  await page.goto(baseURL)

  await upload(page, page.getByText('Click, or drag ttf files to this area'), [
    'ttf/DejaVuSansMono-Oblique.ttf',
    'LICENSE',
    'ttf/DejaVuSansMono-BoldOblique.ttf'
  ])
  await convert(page, 0)
  await expectFinished(page, 'DejaVuSansMono-Oblique.woff2')
  const item = page.locator('.n-upload-file:nth-child(1)')
  await item.hover()
  expect(await download(page, item.locator('button:nth-child(2)'))).toHaveLength(107524)

  await expectFailed(page, 'LICENSE')
  await expectFinished(page, 'DejaVuSansMono-BoldOblique.woff2')

  expect(await download(page, page.getByText('Download all').nth(0))).toHaveLength(216078)
})

test('WOFF2 to TTF', async ({ page }) => {
  await page.goto(baseURL)

  await upload(page, page.getByText('Click, or drag ttf files to this area'), ['ttf/DejaVuSansMono-Oblique.ttf'])
  await convert(page, 0)
  await expectFinished(page, 'DejaVuSansMono-Oblique.woff2')
  const item = page.locator('.n-upload-file:nth-child(1)')
  await item.hover()
  const woff2 = await download(page, page.getByText('Download all').nth(0))

  await upload(page, page.getByText('Click, or drag woff2 files to this area'), {
    name: 'DejaVuSansMono-Oblique.woff2',
    mimeType: 'font/woff2',
    buffer: Buffer.from(woff2)
  })
  await convert(page, 1)
  expect(await download(page, page.getByText('Download all').nth(1))).toHaveLength(251908)
})
