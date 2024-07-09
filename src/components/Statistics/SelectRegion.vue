<script setup>
import {inject, ref, computed, onUpdated, onMounted} from "vue";

const baseUrl = inject('gcr_base_url');

const props = defineProps({
  regions: String,
});

const selectedOption = ref('');

const options = ref(JSON.parse(props.regions))

onMounted(() => {
  selectedOption.value = window.location.href
      .replace(baseUrl + 'statistics/countries', '')
      .replaceAll('/', '');

  if (selectedOption.value === '') {
    selectedOption.value = 'all';
  }
  console.log('selectedOption', selectedOption)
});

onUpdated(() => {
  selectedOption.value = window.location.href
      .replace(baseUrl + 'statistics/countries', '')
      .replaceAll('/', '');

  if (selectedOption.value === '') {
    selectedOption.value = 'all';
  }
  console.log('selectedOption', selectedOption)
});
const handleChange = (value) => {
  // const region = value;
  selectedOption.value = value;

  console.log('value', value);
  if (value === 'all') {
    window.location.href = baseUrl + 'statistics/countries';
  } else {
    window.location.href = baseUrl + 'statistics/countries/' + value;
  }


}


</script>

<template>
  <a-select
      class="select-region-dropdown"
      :options="options"
      v-model:value="selectedOption"
      @change="handleChange">
  </a-select>
</template>

<style scoped>

</style>