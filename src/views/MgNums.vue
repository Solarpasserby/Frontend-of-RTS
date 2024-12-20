<script setup>
import { ref } from "vue";
import { createEntity } from "@/api/admin";
import AdminWatch from "@/components/AdminWatch.vue";

const post = {
  path: "train_run_nums",
  entityUpdate: { name: "列车运行编号" },
  display: { id: "ID", name: "编号", deprecated: "弃用" },
  changes: { deprecated: "弃用" },
};
const runCreate = {
  name: "列车运行编号",
};
const routeCreate = {
  arrival_time: "到站时间",
  departure_time: "离站时间",
  sequence: "站序",
  kilometers: "公里数",
  station_name: "车站名称",
};

const baseDialogVisible = ref(false);
const kidDialogVisible = ref(false);
const isRouteEdit = ref(false);
const runData = ref({});
const routeData = ref({});
const routeDataList = ref([]);

const formLabelWidth = "100px";
const kidFormLabelWidth = "80px";

const handleCreate = () => {
  baseDialogVisible.value = true;
};

const handleCancel = () => {
  runData.value = {};
  routeData.value = {};
  baseDialogVisible.value = false;
};

const handleConfirm = () => {
  for (var route of routeDataList.value) {
    route.arrival_time = route.arrival_time.slice(11, 19);
    route.departure_time = route.departure_time.slice(11, 19);
  }
  runData.value.routes = routeDataList.value;
  createEntity("train_run_nums", runData.value).then(() => {
    runData.value = {};
    routeData.value = {};
    routeDataList.value = [];
    baseDialogVisible.value = false;
  });
};

const handleRouteCreate = () => {
  isRouteEdit.value = false;
  kidDialogVisible.value = true;
};

const handleRouteEdit = (row) => {
  isRouteEdit.value = true;
  routeData.value = row;
  kidDialogVisible.value = true;
};

const handleRouteDelete = (row) => {
  routeDataList.value = routeDataList.value.filter(
    (item) => item.sequence !== row.sequence
  );
};

const handleRouteCancel = () => {
  routeData.value = {};
  kidDialogVisible.value = false;
};

const handleRouteConfirm = () => {
  let temp = JSON.parse(JSON.stringify(routeData.value));
  if (isRouteEdit.value) {
    const index = routeDataList.value.findIndex(
      (item) => item.sequence === temp.sequence
    );
    routeDataList.value[index] = temp;
  } else {
    routeDataList.value.push(temp);
  }
  routeData.value = {};
  kidDialogVisible.value = false;
};
</script>

<template>
  <AdminWatch v-bind="post" @create="handleCreate" />

  <el-drawer
    v-model="baseDialogVisible"
    title="添加列车"
    :before-close="handleCancel"
    direction="rtl"
    size="50%"
  >
    <el-divider>列车信息</el-divider>
    <div class="base-dialog">
      <el-form :model="runData">
        <el-form-item
          v-for="(v, k) in runCreate"
          :label="v"
          :key="k"
          :label-width="formLabelWidth"
        >
          <el-input v-model="runData[k]" />
        </el-form-item>
      </el-form>
    </div>
    <el-divider>车厢信息</el-divider>
    <div>
      <el-table :data="routeDataList" stripe style="width: 100%">
        <el-table-column
          v-for="(v, k) in routeCreate"
          :label="v"
          :prop="k"
        />
        <el-table-column align="right">
          <template #header>
            <el-button
              size="small"
              type="success"
              @click="handleRouteCreate"
            >
              新建
            </el-button>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleRouteEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleRouteDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
    </div>

    <el-dialog v-model="kidDialogVisible" title="站次信息" width="400">
      <el-form :model="routeData">
        <el-form-item
          v-for="(v, k) in routeCreate"
          :key="k"
          :label="v"
          :label-width="kidFormLabelWidth"
        >
          <el-time-picker v-model="routeData[k]" v-if="k === 'departure_time' || k === 'arrival_time'" />
          <el-input v-model="routeData[k]" v-else />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="handleRouteCancel">取消</el-button>
          <el-button type="primary" @click="handleRouteConfirm">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<style scoped>
.base-dialog {
  width: 60%;
}

.base-dialog-footer {
  padding: 20px 40px;
  text-align: right;
}
</style>
