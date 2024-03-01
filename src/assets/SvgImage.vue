<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';

const props = defineProps<{
  name: string;
}>();

const dynamicComponent = computed(() => {
  const name = props.name;
  return defineAsyncComponent(() => import(`../../public/${name}.vue`));
});
</script>

<template>
  <component :is="dynamicComponent" />
</template>