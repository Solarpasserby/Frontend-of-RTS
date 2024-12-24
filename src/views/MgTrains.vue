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
const isCarriageEdit = ref(false);
const trainData = ref({});
const carriageData = ref({});
const carriageDataList = ref([]);
const adminWatchRef = ref(null);

const formLabelWidth = "60px";
const kidFormLabelWidth = "80px";

const handleCreate = () => {
  baseDialogVisible.value = true;
};

const handleCancel = () => {
  trainData.value = {};
  carriageData.value = {};
  baseDialogVisible.value = false;
};

const handleConfirm = async () => {
  trainData.value.carriages = carriageDataList.value;
  createEntity("trains", trainData.value).then(() => {
    trainData.value = {};
    carriageData.value = {};
    carriageDataList.value = [];
    baseDialogVisible.value = false;
  });
  if (adminWatchRef.value) {
    await adminWatchRef.value.refreshTable();
  }
};

const handleCarriageCreate = () => {
  isCarriageEdit.value = false;
  kidDialogVisible.value = true;
};

const handleCarriageEdit = (row) => {
  isCarriageEdit.value = true;
  carriageData.value = row;
  kidDialogVisible.value = true;
};

const handleCarriageDelete = (row) => {
  carriageDataList.value = carriageDataList.value.filter(
    (item) => item.num !== row.num
  );
};

const handleCarriageCancel = () => {
  carriageData.value = {};
  kidDialogVisible.value = false;
};

const handleCarriageConfirm = () => {
  let temp = JSON.parse(JSON.stringify(carriageData.value));
  temp.seat_rows = parseInt(temp.seat_rows);
  temp.num = parseInt(temp.num);
  if (isCarriageEdit.value) {
    const index = carriageDataList.value.findIndex(
      (item) => item.num === carriageData.value.num
    );
    carriageDataList.value[index] = temp;
  } else {
    carriageDataList.value.push(temp);
  }
  carriageData.value = {};
  kidDialogVisible.value = false;
};
</script>

<template>
  <AdminWatch ref="adminWatchRef" v-bind="post" @create="handleCreate" />

  <el-drawer
    v-model="baseDialogVisible"
    title="添加列车"
    :before-close="handleCancel"
    direction="rtl"
    size="50%"
  >
    <el-divider>列车信息</el-divider>
    <div class="base-dialog">
      <el-form :model="trainData">
        <el-form-item
          v-for="(v, k) in trainCreate"
          :label="v"
          :key="k"
          :label-width="formLabelWidth"
        >
          <!-- <el-input v-model="trainData[k]" /> -->
          <el-select v-model="trainData[k]">
            <el-option label="高速列车" value="fast" />
            <el-option label="低速列车" value="slow" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-divider>车厢信息</el-divider>
    <div>
      <el-table :data="carriageDataList" stripe style="width: 100%">
        <el-table-column
          v-for="(v, k) in carriageCreate"
          :label="v"
          :prop="k"
        />
        <el-table-column align="right">
          <template #header>
            <el-button
              size="small"
              type="success"
              @click="handleCarriageCreate"
            >
              新建
            </el-button>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleCarriageEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleCarriageDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
      >
        确认
      </el-button>
    </div>

    <el-dialog v-model="kidDialogVisible" title="车厢信息" width="400">
      <el-form :model="carriageData">
        <!-- <el-form-item
          v-for="(v, k) in carriageCreate"
          :key="k"
          :label="v"
          label-width="80px"
        >
          <el-input v-model="carriageData[k]" />
        </el-form-item> -->
        <el-form-item label="车厢号" :label-width="kidFormLabelWidth">
          <el-input v-model="carriageData.num" />
        </el-form-item>
        <el-form-item label="车厢类型" :label-width="kidFormLabelWidth">
          <el-select v-model="carriageData.type">
            <el-option label="二等座" value="second_class" />
            <el-option label="一等座" value="first_class" />
            <el-option label="商务座" value="business" />
          </el-select>
        </el-form-item>
        <el-form-item label="车厢号" :label-width="kidFormLabelWidth">
          <el-select v-model="carriageData.seat_rows">
            <el-option
              label="8"
              value=8
              v-if="carriageData.type === 'business'"
            />
            <el-option
              label="10"
              value=10
              v-if="carriageData.type === 'first_class'"
            />
            <el-option
              label="12"
              value=12
              v-if="carriageData.type !== 'business'"
            />
            <el-option
              label="16"
              value=16
              v-if="carriageData.type === 'second_class'"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="handleCarriageCancel">取消</el-button>
          <el-button
            type="primary"
            @click="handleCarriageConfirm"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<style scoped>
.base-dialog {
  width: 45%;
}

.base-dialog-footer {
  padding: 20px 40px;
  text-align: right;
}
</style>
