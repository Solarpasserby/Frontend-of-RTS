<script setup>
import AdminWatch from "@/components/AdminWatch.vue";
const post = {
  path: "stations",
  entityBase: { name: "车站名称", city: "所属城市" },
  display: { id: "ID", name: "名称", city: "城市" },
  changes: { deprecated: "弃用" },
};
</script>

<template>
  <AdminWatch v-bind="post"/>
</template>
