<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login, createUser } from "@/api/user";
import { authenticateAdmin } from "@/api/admin";

const mode = ref(1);
const isReg = ref(false);
const msg = ref("登录");
const postForm = ref({
  name: "",
  telephone: "",
  password: "",
});

const router = useRouter();

const handleSwitch = (index) => {
  postForm.value.name = "";
  postForm.value.telephone = "";
  postForm.value.password = "";
  mode.value = index;
  isReg.value = index === 2;
    msg.value = index === 2 ? "注册" : "登录";
};

const handlePost = async () => {
  try {
    let res;
    switch (mode.value) {
      case 1:
        res = await login(postForm.value);
        console.log(res);
        if (res.status == 200) {
          router.push(`/home/${res.data.id}`);
        }
        break;
      case 2:
        res = await createUser(postForm.value);
        if (res.status == 200) {
          router.push(`/login`);
        }
        break;
      case 3:
        delete postForm.value.telephone;
        res = await authenticateAdmin(postForm.value);
        if (res.status == 200) {
          router.push(`/admin`);
        }
        break;
    }
  } catch (error) {
      console.error(error);
  }
};
</script>

<template>
  <div class="login-container">
    <el-menu mode="horizontal" default-active="1" class="menu">
      <el-menu-item index="1" class="menu-item" @click="handleSwitch(1)">登录</el-menu-item>
      <el-menu-item index="2" class="menu-item" @click="handleSwitch(2)">注册</el-menu-item>
      <el-menu-item index="3" class="menu-item" @click="handleSwitch(3)">管理</el-menu-item>
    </el-menu>
    <el-form :model="postForm" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="postForm.name" />
      </el-form-item>
      <el-form-item label="电话" prop="telephone" v-show="isReg">
        <el-input v-model="postForm.telephone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="postForm.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handlePost">{{ msg }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-container {
  position: absolute;
  top: 30%;
  left: 65%;
  width: 320px;
  padding: 40px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.menu {
  display: flex;
  justify-content: center;
  margin-top: -20px;
  margin-bottom: 40px;
}

.menu-item {
  margin: 0 5px;
}
</style>
