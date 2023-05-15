<script setup lang="ts">
import { NSpace } from 'naive-ui'
import MyUpload from '../components/MyUpload.vue'
import { ttfToWoff2 } from '../workerAPI'
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
  </n-space>
</template>
