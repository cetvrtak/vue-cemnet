<template>
  <a-table bordered class="summary-container"
           :dataSource="summaryData"
           :pagination="false"
           size="small"
           :columns="columns">
  </a-table>
</template>

<script setup>
import {Table} from "ant-design-vue";

const props = defineProps({
    integrated: Number,
    clinker: Number,
    grinding: Number,
    cementCapacity: Number
});

const columns = [
  {
    title: 'Summary',
    colSpan: 2,
    dataIndex: 'summary',
    key: 'summary',
    children: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 0,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        width: 0,
      },
    ],
  },
];

const summaryData = [
    {
        key: '1',
        name: 'Cement capacity',
        value: props.cementCapacity + " [Mt]",
    },
    {
        key: '2',
        name: 'Integrated plants',
        value: props.integrated,
    },
    {
        key: '3',
        name: 'Clinker plants',
        value: props.clinker,
    },
    {
        key: '4',
        name: 'Grinding plants',
        value: props.grinding,
    },
];
</script>