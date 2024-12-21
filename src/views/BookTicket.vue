<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { getRuns, createOrder } from "@/api/user";

const formInline = ref({
  start_station: "",
  end_station: "",
  running_date: null,
});
const runList = ref([]);
const orderClass = ref("second_class");
const chosenRun = ref({});
const route = useRoute();

const isReady = ref(false);
const dialogFormVisible = ref(false);
const price_multiple_dict = {
  fast: 0.45,
  slow: 0.3,
  second_class: 1,
  first_class: 2,
  business: 4,
};

const tableData = computed(() => {
  return runList.value.map((run) => {
    let startTime = "",
      endTime = "";
    let startId = 0,
      endId = 0;
    let startSeq = 0,
      endSeq = 0;
    let totalRoutes = run.train_run_num.routes.length;
    for (var route of run.train_run_num.routes) {
      if (route.station.name == formInline.value.start_station) {
        startTime = route.arrival_time;
        startId = route.id;
        startSeq = route.sequence;
      }
      if (route.station.name == formInline.value.end_station) {
        endTime = route.arrival_time;
        endId = route.id;
        endSeq = route.sequence;
        break;
      }
    }

    return {
      num_name: run.train_run_num.name,
      train_run_id: run.id,
      train_run_num_id: run.train_run_num.id,
      total_routes: totalRoutes,
      is_through: startSeq === 1 && endSeq === totalRoutes,
      start_route_id: startId,
      start_seq: startSeq,
      start_station: formInline.value.start_station,
      start_time: startTime,
      end_route_id: endId,
      end_seq: endSeq,
      end_station: formInline.value.end_station,
      end_time: endTime,
      distance:
        run.train_run_num.routes[1].kilometers -
        run.train_run_num.routes[0].kilometers,
    };
  });
});

const orderPrice = computed(() => {
  let price = 0;
  if (
    chosenRun.value.num_name[0] == "G" ||
    chosenRun.value.num_name[0] == "D"
  ) {
    price = chosenRun.value.distance * price_multiple_dict.fast;
  } else {
    price = chosenRun.value.distance * price_multiple_dict.slow;
  }
  price *= price_multiple_dict[orderClass.value];
  return price;
});

const handleQuery = () => {
  getRuns({
    start_station: formInline.value.start_station,
    end_station: formInline.value.end_station,
    running_date: formInline.value.running_date
      .toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-"),
  }).then((res) => {
    runList.value = res.data;
  });
};

const handleRowClick = (row) => {
  chosenRun.value = row;
  dialogFormVisible.value = true;
};

const handleCancel = () => {
  dialogFormVisible.value = false;
};

const handleConfirm = () => {
  createOrder({
    user_id: parseInt(route.params.userId),
    is_through: chosenRun.value.is_through,
    total_routes: chosenRun.value.total_routes,
    train_run_id: chosenRun.value.train_run_id,
    train_run_num_id: chosenRun.value.train_run_num_id,
    start_route_id: chosenRun.value.start_route_id,
    start_seq: chosenRun.value.start_seq,
    end_route_id: chosenRun.value.end_route_id,
    end_seq: chosenRun.value.end_seq,
    price: orderPrice.value,
  }).then((res) => {
    if (res.status == 200) {
      dialogFormVisible.value = false;
      alert("订单提交成功");
    }
  });
};

watch(
  () => formInline.value,
  (value) => {
    isReady.value =
      value.start_station && value.end_station && value.running_date;
  },
  { deep: true }
);
</script>

<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="出发地">
        <el-input v-model="formInline.start_station" />
      </el-form-item>
      <el-form-item label="目的地">
        <el-input v-model="formInline.end_station" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="formInline.running_date"
          type="date"
          placeholder="选择一个日期"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" :disabled="!isReady"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div>
    <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
      <el-table-column prop="num_name" label="列车运行编号" />
      <el-table-column prop="start_station" label="出发车站" />
      <el-table-column prop="start_time" label="出发时间" />
      <el-table-column prop="end_station" label="到达车站" />
      <el-table-column prop="end_time" label="到达时间" />
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" title="提交订单" width="500">
    <div class="formDiv">
      <span class="formSpan">{{ chosenRun.num_name }}</span>
      <span class="formSpan">{{ chosenRun.start_station }}</span>
      <span> ---> </span>
      <span class="formSpan">{{ chosenRun.end_station }}</span>
    </div>
    <el-select v-model="orderClass" style="width: 200px" class="formSelect">
      <el-option label="二等座" value="second_class" />
      <el-option label="一等座" value="first_class" />
      <el-option label="商务座" value="business" />
    </el-select>
    <span class="price">价格: {{ orderPrice }}</span>
    <template #footer>
      <div>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.formDiv {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.formSpan {
  font-size: medium;
  font-weight: 400;
  color: #000;
  padding: 0 20px;
}

.formSelect {
  margin-left: 20px;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: yellow;
  margin-left: 100px;
}
</style>
