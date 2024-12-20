<script setup>
import AdminWatch from "@/components/AdminWatch.vue";
const post = {
  path: "train_runs",
  entityBase: { running_date: "运行日期" },
  entityCreate: { train_id: "所属列车", train_run_num_id: "列车运行编号" },
  entityUpdate: { lock: "锁定" },
  display: { id: "ID", running_date: "运行日期", "train.id": "所属列车", "train_run_num.name": "列车运行编号" }, 
  changes: { finished: "完成" },
};
</script>

<template>
  <AdminWatch v-bind="post" />
</template>
