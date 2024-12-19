<script setup>
import AdminWatch from '@/components/AdminWatch.vue';
const post = {
  path: 'users',
  entity: { name: '用户名', telephone: '电话', password: '密码' },
  display: { id: 'ID', name: '用户名', telephone: '电话' },
  changes: { banned: '封禁' },
}
</script>

<template>
  <AdminWatch v-bind="post" />
</template>