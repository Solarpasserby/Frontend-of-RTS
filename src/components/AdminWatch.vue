<script setup>
import { computed, ref, onMounted, watch } from "vue";
import {
  createEntity,
  getEntities,
  updateEntity,
  deleteEntity,
  setEntityStatus,
  getTableCount,
} from "@/api/admin";

const props = defineProps({
  // example: path: "stations"
  path: String,
  // example: entity: { name: "车站名称", city: "所属城市" }
  entityBase: Object,
  entityCreate: Object,
  entityUpdate: Object,
  // example: display: { id: "ID", name: "名称", city: "所属城市" }
  display: Object,
  // example: changes: { deprecated: "弃用" }
  changes: Object,
});

const emit = defineEmits(["rowClick", "create"]);

const total = ref(0);
const entityData = ref({});
const entityId = ref(null);
const tableData = ref([]);
const DialogVisible = ref(false);
const isEdit = ref(false);
const currentPage = ref(1);

const formLabelWidth = "120px";
const limit = 10;
const offset = computed(() => (currentPage.value - 1) * limit);

const isFormNecessary = computed(() => {
  return props.path !== "users" && props.path !== "orders";
});

const refreshTable = () => {
  getEntities(props.path, offset.value, limit).then((res) => {
    tableData.value = res.data;
  });
};

const handleCreate = () => {
  entityData.value = {};
  isEdit.value = false;
  if (props.path === "stations" || props.path === "train_runs") {
    DialogVisible.value = true;
  } else {
    emit("create");
  }
};

const handleEdit = (row) => {
  entityData.value = {};
  entityId.value = row.id;
  isEdit.value = true;
  DialogVisible.value = true;
};

const handleDelete = (row) => {
  let isConfirm = confirm(`确定删除ID为 ${row.id} 对应的实例吗？`);
  if (!isConfirm) return;
  deleteEntity(props.path, row.id).then(() => {
    total.value -= 1;
    getEntities(props.path, offset.value, limit).then((res) => {
      tableData.value = res.data;
    });
  });
};

const setStatus = (row, kidPath) => {
  let isConfirm = confirm(`确定修改ID为 ${row.id} 对应的实例吗？`);
  if (!isConfirm) return;

  if (props.path !== "orders") {
    let status = {
      [kidPath]: true,
    };
    setEntityStatus(props.path, row.id, kidPath, status).then(() => {
      getEntities(props.path, offset.value, limit).then((res) => {
        tableData.value = res.data;
      });
    });
  } else {
    // 应付orders，可能存在问题
    setEntityStatus(props.path, row.id, kidPath).then(() => {
      getEntities(props.path, offset.value, limit).then((res) => {
        tableData.value = res.data;
      });
    });
  }
};

const handleCancel = () => {
  entityData.value = {};
  DialogVisible.value = false;
};

const handleConfirm = () => {
  if (isEdit.value) {
    updateEntity(props.path, entityId.value, entityData.value).then(() => {
      entityData.value = {};
      DialogVisible.value = false;
      getEntities(props.path, offset.value, limit).then((res) => {
        tableData.value = res.data;
      });
    });
  } else {
    createEntity(props.path, entityData.value).then(() => {
      entityData.value = {};
      DialogVisible.value = false;
      total.value += 1;
      getEntities(props.path, offset.value, limit).then((res) => {
        tableData.value = res.data;
      });
    });
  }
};

watch(currentPage, () => {
  getEntities(props.path, offset.value, limit).then((res) => {
    tableData.value = res.data;
  });
});

onMounted(() => {
  getTableCount(props.path).then((res) => {
    total.value = res.data.count;
  });
  getEntities(props.path, offset.value, limit).then((res) => {
    tableData.value = res.data;
  });
});

defineExpose({
  refreshTable,
});
</script>

<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    @row-click="(row) => emit('rowClick', row)"
  >
    <el-table-column v-for="(v, k) in display" :key="k" :label="v" :prop="k" />
    <el-table-column align="right">
      <template #header>
        <el-button
          size="small"
          type="success"
          @click="handleCreate"
          v-if="isFormNecessary"
        >
          新建
        </el-button>
      </template>
      <template #default="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.row)"
          v-if="isFormNecessary"
        >
          编辑
        </el-button>
        <el-button
          size="small"
          type="warning"
          v-for="(v, k) in changes"
          :key="k"
          @click="setStatus(scope.row, k)"
        >
          {{ v }}
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="limit"
      v-model:current-page="currentPage"
    />
  </div>

  <el-dialog v-model="DialogVisible" title="修改数据" width="500" v-if="isFormNecessary">
    <el-form :model="entityData">
      <el-form-item
        v-for="(v, k) in entityBase"
        :key="k"
        :label="v"
        :label-width="formLabelWidth"
      >
        <el-input v-model="entityData[k]" />
      </el-form-item>
      <el-form-item
        v-for="(v, k) in entityCreate"
        v-if="!isEdit"
        :key="k"
        :label="v"
        :label-width="formLabelWidth"
      >
        <el-input v-model="entityData[k]" />
      </el-form-item>
      <el-form-item
        v-for="(v, k) in entityUpdate"
        v-if="isEdit"
        :key="k"
        :label="v"
        :label-width="formLabelWidth"
      >
        <el-input v-model="entityData[k]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.pagination {
  display: flex;
  margin-top: 30px;
  justify-content: center;
}
</style>