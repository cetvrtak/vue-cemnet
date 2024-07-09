<script setup>
import {inject} from "vue";

const baseUrl = inject('gcr_base_url');

const props = defineProps({
  data: String,
});

const columns = [
  {
    title: 'Country',
    key: 'countryName',
    dataIndex: 'countryName'
  },
  {
    title: 'Region',
    key: 'regionName',
    dataIndex: 'regionName'
  },
];
</script>

<template>
  <a-table
      class="ant-table-striped box"
      size="small"
      :pagination="false"
      :columns="columns"
      :data-source="JSON.parse(props.data)"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'countryName'">
        <a-anchor-link :href="baseUrl + 'statistics/country/' + record.countryUnqName" :title="record.countryName"></a-anchor-link>
      </template>
      <template v-else-if="column.key === 'regionName'">
        <a-anchor-link :href="baseUrl + 'statistics/region/' + record.countryUnqName" :title="record.regionName"></a-anchor-link>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
    .ant-table-striped {
        margin-bottom: 20px;
    }
  .ant-table-striped :deep(.table-striped) td {
    background-color: #F9F9F9;
  }
</style>