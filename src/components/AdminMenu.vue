<script setup>
</script>

<template>
  <el-menu class="menu-vertical" :router="true" default-active="1">
    <el-menu-item index="1" route="/admin/stations">车站信息</el-menu-item>
    <el-menu-item index="2" route="/admin/trains">列车信息</el-menu-item>
    <el-menu-item index="3" route="/admin/users">用户信息</el-menu-item>
    <el-menu-item index="4" route="/admin/orders">订单信息</el-menu-item>
    <el-menu-item index="5" route="/admin/runs">班次信息</el-menu-item>
    <el-menu-item index="6" route="/admin/nums">车次信息</el-menu-item>
  </el-menu>
</template>