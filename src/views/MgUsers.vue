<script setup>
import AdminWatch from '@/components/AdminWatch.vue';
const post = {
  path: 'users',
  display: { id: 'ID', name: '用户名', telephone: '电话', banned: '是否封禁' },
  changes: { banned: '封禁' },
}
</script>

<template>
  <AdminWatch v-bind="post" />
</template>