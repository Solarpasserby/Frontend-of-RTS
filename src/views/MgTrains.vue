<script setup>
import AdminWatch from '@/components/AdminWatch.vue';
const post = {
  path: 'trains',
  // 出现了意料之外的错误，这里有个参数是列表，这里做不了
}
</script>

<template>
  <AdminWatch path="trains" />
</template>