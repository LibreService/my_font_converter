<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { NCard, NUpload, NUploadDragger, NIcon, NSpace, NButton, UploadFileInfo } from 'naive-ui'
import { AttachFileFilled } from '@vicons/material'
import { downloadZip } from 'client-zip'
import { registerProgressCallback } from '../workerAPI'

const props = defineProps<{
  title: string
  extension: string
  extensions: string[]
  converter:(buffer: ArrayBuffer) => Promise<ArrayBuffer>
}>()

function appendExtension (name: string) {
  return name + '.' + props.extension
}

const started = ref<boolean>(false)
const running = ref<boolean>(false)
const files = ref<UploadFileInfo[]>([])
const availableFiles = ref<{[key: string]: {
  name: string
  buffer: ArrayBuffer
}}>({})
const downloadable = computed(() => Object.keys(availableFiles.value).length > 0)

watchEffect(() => {
  if (files.value.length === 0) {
    started.value = false
  }
})

function clearAll () {
  files.value = []
  availableFiles.value = {}
}

async function convert () {
  started.value = true
  running.value = true
  for (const fileInfo of files.value) {
    fileInfo.status = 'uploading'
    registerProgressCallback((percentage: number) => {
      fileInfo.percentage = percentage
    })
    try {
      const buffer = await props.converter(await fileInfo.file!.arrayBuffer())
      if (buffer.byteLength === 0) {
        fileInfo.status = 'error'
      } else {
        fileInfo.status = 'finished'
        const i = fileInfo.name.lastIndexOf('.')
        const name = appendExtension(i >= 0 ? fileInfo.name.slice(0, i) : fileInfo.name)
        fileInfo.name = name + ' ✅'
        availableFiles.value[fileInfo.id] = {
          name, buffer
        }
      }
    } catch (e) {
      console.error(e)
      fileInfo.status = 'error'
      break
    }
  }
  running.value = false
}

function onRemove ({ file }: { file: UploadFileInfo }) {
  delete availableFiles.value[file.id]
  return true
}

function downloadBlob (blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadBuffer (buffer: ArrayBuffer, name: string) {
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  downloadBlob(blob, name)
}

function onDownload (file: UploadFileInfo) {
  const { name, buffer } = availableFiles.value[file.id]
  downloadBuffer(buffer, name)
}

async function downloadAll () {
  const values = Object.values(availableFiles.value)
  if (values.length === 1) {
    const { name, buffer } = values[0]
    return downloadBuffer(buffer, name)
  }
  const blob = await downloadZip(values.map(({ name, buffer }) => ({
    name, input: buffer
  }))).blob()
  return downloadBlob(blob, `${props.extension}-fonts.zip`)
}
</script>

<template>
  <n-card :title="title">
    <n-upload
      v-model:file-list="files"
      multiple
      :disabled="running"
      :default-upload="false"
      :show-retry-button="false"
      show-download-button
      :on-remove="onRemove"
      :on-download="onDownload"
    >
      <n-upload-dragger v-show="!started">
        <div style="margin-bottom: 16px">
          <n-icon :size="32">
            <attach-file-filled />
          </n-icon>
        </div>
        Click, or drag {{ extensions.join('/') }} files to this area
      </n-upload-dragger>
    </n-upload>
    <template #action>
      <n-space style="justify-content: end">
        <n-button
          secondary
          type="error"
          :disabled="files.length === 0 || running"
          @click="clearAll"
        >
          Clear all
        </n-button>
        <n-button
          secondary
          type="info"
          :disabled="files.length === 0 || started"
          @click="convert"
        >
          Convert
        </n-button>
        <n-button
          secondary
          type="success"
          :disabled="!downloadable || running"
          @click="downloadAll"
        >
          Download all
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>
