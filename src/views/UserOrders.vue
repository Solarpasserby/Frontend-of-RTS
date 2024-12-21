<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getOrders, completeOrder, cancelOrder } from "@/api/user";

const orderList = ref([]);
const route = useRoute();

const statusDict = {
  pending: "待支付",
  completed: "已完成",
  cancelled: "已取消",
};
const carriageClassDict = {
  second_class: "二等座",
  first_class: "一等座",
  business: "商务座",
};

const boxList = computed(() => {
  return orderList.value.map((order) => {
    return {
      id: order.id,
      status: order.status,
      created_at: order.created_at.toLocaleString().slice(0, 19),
      num_name: order.ticket.ticket_slot.train_run.train_run_num.name,
      carriage_class: order.ticket.ticket_slot.seat.carriage.type,
      price: order.ticket.price,
    };
  });
});

const handlePay = (box) => {
  completeOrder(box.id).then(() => {
    getOrders(route.params.userId).then((res) => {
      orderList.value = res.data;
    });
  });
};

const handleCancel = (box) => {
  var r = confirm("确定取消订单吗？");
  if (!r) {
    return;
  }
  cancelOrder(box.id).then(() => {
    getOrders(route.params.userId).then((res) => {
      orderList.value = res.data;
    });
  });
};

onMounted(() => {
  getOrders(route.params.userId).then((res) => {
    orderList.value = res.data;
  });
});
</script>

<template>
  <div class="container">
    <div v-for="box in boxList">
      <div :class="box.status" class="box">
        <p class="title-p">{{ statusDict[box.status] }}</p>
        <p>{{ box.created_at }}</p>
        <span class="train-info-span">{{ box.num_name }}</span>
        <span class="train-info-span">{{
          carriageClassDict[box.carriage_class]
        }}</span>
        <p>支付：{{ box.price }}元</p>
        <div>
          <el-button link @click="handlePay(box)" v-if="box.status === 'pending'"> 支付 </el-button>
          <el-button link @click="handleCancel(box)" v-if="box.status !== 'cancelled'"> 取消 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.box {
  padding: 10px 20px;
  font-size: medium;
  border-radius: 10px;
  width: 250px;
  height: 140px;
}

.box p {
  margin: 5px 0;
}

.title-p {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.pending {
  background-color: yellow;
  color: white;
}

.completed {
  background-color: rgb(0, 207, 0);
  color: white;
}

.cancelled {
  background-color: gray;
  color: black;
}

.train-info-span {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 600;
}
</style>
