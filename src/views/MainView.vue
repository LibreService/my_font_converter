<script setup lang="ts">
import { NSpace } from 'naive-ui'
import { MyBulkConverter } from '@libreservice/my-widget'
import { ttfToWoff2, woff2ToTtf } from '../workerAPI'
</script>

<template>
  <n-space
    vertical
    class="my-column"
  >
    <my-bulk-converter
      title="TTF to WOFF2"
      :extensions="['ttf']"
      zip-name="woff2-fonts"
      :converter="ttfToWoff2"
    />
    <my-bulk-converter
      title="WOFF2 to TTF"
      :extensions="['woff2']"
      zip-name="ttf-fonts"
      :converter="woff2ToTtf"
    />
  </n-space>
</template>
