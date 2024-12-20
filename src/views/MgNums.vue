<script setup>
import { ref } from "vue";
import { createEntity } from "@/api/admin";
import AdminWatch from "@/components/AdminWatch.vue";

const post = {
  path: "trains",
  entityBase: {},
  entityUpdate: { valid: "正常工作" },
  display: { id: "ID", type: "类型", valid: "正常工作", deprecated: "弃用" },
  changes: { deprecated: "弃用" },
};
const trainCreate = {
  type: "类型",
};
const carriageCreate = {
  num: "车厢号",
  type: "车厢类型",
  seat_rows: "座位行数",
};

const baseDialogVisible = ref(false);
const kidDialogVisible = ref(false);
const trainData = ref({});
const carriageData = ref({});

const formLabelWidth = "120px";
const kidFormLabelWidth = "80px";

const handleCreate = () => {
  baseDialogVisible.value = true;
};

const handleCancel = () => {
  trainData.value = {};
  carriageData.value = {};
  baseDialogVisible.value = false;
};

const handleConfirm = () => {
  createEntity("trains", trainData.value);
  trainData.value = {};
  carriageData.value = {};
  baseDialogVisible.value = false;
};
</script>

<template>
  <AdminWatch path="trains" @create="handleCreate" />

  <el-drawer
    v-model="baseDialogVisible"
    title="添加列车"
    :before-close="handleCancel"
    direction="ltr"
  >
    <div>
      <el-form :model="trainData">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Area" :label-width="formLabelWidth">
          <el-select
            v-model="form.region"
            placeholder="Please select activity area"
          >
            <el-option label="Area1" value="shanghai" />
            <el-option label="Area2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="onClick">
          {{ loading ? "Submitting ..." : "Submit" }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
