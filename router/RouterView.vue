<template>
  <component :is="comp"></component>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from ".";

const router = useRouter();

// router.current是一个响应式的值，当触发更新的时候，就会寻找对应的组件
const comp = computed(() => {
  const route = router.routes.find((r) => r.path === router.current.value);
  return route ? route.component : null;
});
</script>

<style lang="scss" scoped>
</style>
