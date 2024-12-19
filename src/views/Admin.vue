<script setup>
import Header from "@/components/Header.vue";
import AdminMenu from "@/components/AdminMenu.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header" height="50px">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="250px">
          <AdminMenu />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100%;
}

.header {
  display: flex;
  background-color: #a5c6e9;
  align-items: center;
}

.menu-vertical {
  height: 100%;
}
</style>