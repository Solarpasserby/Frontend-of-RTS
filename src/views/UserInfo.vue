<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getUser, updateUser } from "@/api/user";
import { ElNotification } from 'element-plus'

const userInfo = ref({});
const postForm = ref({});
const isModify = ref(false);

const route = useRoute();

const updateUserInfo = async () => {
  const res = await updateUser(route.params.userId, postForm.value);
  if (res.status === 200) {
    userInfo.value = res.data;
    ElNotification({
      title: '成功',
      message: '用户信息更新成功',
      type: 'success',
    });
  } else {
    ElNotification({
      title: '失败',
      message: '用户信息更新失败',
      type: 'error',
    });
  }
  postForm.value = {};
};

const handleModify = () => {
  isModify.value = true;
};

const handleSubmit = () => {
  updateUserInfo();
  isModify.value = false;
};

const handleCancel = () => {
  isModify.value = false;
  postForm.value = {};
};

onMounted(() => {
  getUser(route.params.userId).then((res) => {
    userInfo.value = res.data;
  });
});
</script>

<template>
  <el-row class="row">
    <el-col :span="5" class="main-title">信息中心</el-col>
    <el-col :span="10"></el-col>
    <el-button type="primary" @click="handleModify" v-if="!isModify"
      >修改</el-button
    >
    <el-button type="success" @click="handleSubmit" v-if="isModify"
      >提交</el-button
    >
    <el-button type="info" @click="handleCancel" v-if="isModify"
      >取消</el-button
    >
  </el-row>

  <el-row class="row" v-if="!isModify">
    <el-col :span="5">用户名：</el-col>
    <el-col :span="10">{{ userInfo.name }}</el-col>
  </el-row>
  <el-row class="row" v-if="!isModify">
    <el-col :span="5">电话：</el-col>
    <el-col :span="10">{{ userInfo.telephone }}</el-col>
  </el-row>

  <el-row class="row" v-if="isModify">
    <el-col :span="5">用户名：</el-col>
    <el-col :span="10">
      <el-input v-model="postForm.name" placeholder="请输入用户名"></el-input>
    </el-col>
  </el-row>
  <el-row class="row" v-if="isModify">
    <el-col :span="5">电话：</el-col>
    <el-col :span="10">
      <el-input
        v-model="postForm.telephone"
        placeholder="请输入电话"
      ></el-input>
    </el-col>
  </el-row>
  <el-row class="row" v-if="isModify">
    <el-col :span="5">密码：</el-col>
    <el-col :span="10">
      <el-input
        v-model="postForm.password"
        placeholder="请输入密码"
        type="password"
      ></el-input>
    </el-col>
  </el-row>
</template>

<style scoped>
.row {
  margin: 20px 0;
}

.main-title {
  font-size: 20px;
  font-weight: bold;
}
</style>
