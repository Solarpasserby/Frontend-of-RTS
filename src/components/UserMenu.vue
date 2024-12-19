<script setup>
import { computed } from 'vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  defaultActive: {
    type: String,
    default: '1',
  },
});

const infoUrl = computed(() => {
  return `/home/${props.userId}/info`;
});
const bookUrl = computed(() => {
  return `/home/${props.userId}/book`;
});
const ordersUrl = computed(() => {
  return `/home/${props.userId}/orders`;
});
const ticketUrl = computed(() => {
  return `/home/${props.userId}/tickets`;
});
</script>

<template>
  <el-menu class="menu-vertical" :router="true" :default-active="props.defaultActive">
    <el-menu-item index="1" :route="infoUrl">信息中心</el-menu-item>
    <el-menu-item index="2" :route="bookUrl">我要购票</el-menu-item>
    <el-menu-item index="3" :route="ordersUrl">我的订单</el-menu-item>
    <el-menu-item index="4" :route="ticketUrl">我的车票</el-menu-item>
  </el-menu>
</template>
