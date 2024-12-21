<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getOrders, getNums } from "@/api/user";

const orderList = ref([]);
const route = useRoute();
const boxList = ref([]);

const carriageClassDict = {
  second_class: "二等座",
  first_class: "一等座",
  business: "商务座",
};

const fetchBoxList = async () => {
  const orders = orderList.value;
  const boxes = await Promise.all(
    orders.map(async (order) => {
      let num_id = order.ticket.ticket_slot.train_run.train_run_num.id;
      let start_seq = order.ticket.start_sequence;
      let end_seq = order.ticket.end_sequence;
      let startStation = "", endStation = "";
      let startTime = "", endTime = "";

      const res = await getNums(num_id);
      for (const route of res.data.routes) {
        if (route.sequence == start_seq) {
          startStation = route.station.name;
          startTime = route.arrival_time.slice(0, 5);
        }
        if (route.sequence == end_seq) {
          endStation = route.station.name;
          endTime = route.arrival_time.slice(0, 5);
          break;
        }
      }

      return {
        status: order.status,
        num_name: order.ticket.ticket_slot.train_run.train_run_num.name,
        start_station: startStation,
        end_station: endStation,
        start_time: startTime,
        end_time: endTime,
        carriage_class: order.ticket.ticket_slot.seat.carriage.type,
        carriage_num: order.ticket.ticket_slot.seat.carriage.num,
        seat_num: order.ticket.ticket_slot.seat.seat_num,
      };
    })
  );
  boxList.value = boxes;
};

onMounted(async () => {
  const res = await getOrders(route.params.userId);
  orderList.value = res.data;
  await fetchBoxList();
});
</script>

<template>
  <div class="container">
    <div v-for="box in boxList">
      <div class="box" v-if="box.status === 'completed'">
        <p class="train-class-p">
          {{ carriageClassDict[box.carriage_class] }}
        </p>
        <span class="train-info-span">{{ box.num_name }}</span>
        <span class="train-info-span">车厢 {{ box.carriage_num }}</span>
        <span class="train-info-span">座位 {{ box.seat_num }}</span>
        <el-row>
          <el-col :span="8">
            <p>{{ box.start_station }}</p>
          </el-col>
          <el-col :span="4">
            <p>---> </p>
          </el-col>
          <el-col :span="8">
            <p>{{ box.end_station }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="time-col">
            {{ box.start_time }}
          </el-col>
          <el-col :span="12" class="time-col">
            {{ box.end_time }}
          </el-col>
        </el-row>
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
  height: 150px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.train-class-p {
  font-size: 18px;
  color: gold;
  font-weight: 600;
  margin: 10px 0;
}

.train-info-span {
  margin-right: 10px;
  font-size: 16px;
  font-weight: 600;
}

.time-col {
  font-size: 16px;
  font-weight: 600;
  color: blue;
}
</style>
