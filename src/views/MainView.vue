<script setup lang="ts">
import { NSpace } from 'naive-ui'
import MyUpload from '../components/MyUpload.vue'
import { ttfToWoff2, woff2ToTtf } from '../workerAPI'
</script>

<template>
  <n-space
    vertical
    class="my-column"
  >
    <my-upload
      title="TTF to WOFF2"
      extension="woff2"
      :extensions="['ttf']"
      :converter="ttfToWoff2"
    />
    <my-upload
      title="WOFF2 to TTF"
      extension="ttf"
      :extensions="['woff2']"
      :converter="woff2ToTtf"
    />
  </n-space>
</template>
