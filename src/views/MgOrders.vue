<script setup>
import AdminWatch from "@/components/AdminWatch.vue";
const post = {
  path: "orders",
  display: { id: "ID", user_id: "用户ID", status: "状态" },
  changes: { complete: "完成", cancel: "取消" },
};
</script>

<template>
  <AdminWatch v-bind="post" />
</template>
