<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUser } from '@/api/user';

const route = useRoute();

const fetchUserInfo = async () => {
  const res = await getUser(route.params.userId);
  console.log(res);
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>

</template>

<style scoped>
</style>