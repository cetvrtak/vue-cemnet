<script setup>
import { h } from "vue";

const props = defineProps({
  title: String,
  year: Number,
  consumption: Number,
  production: Number,
  export: Number,
  import: Number,
  cementCapacity: Number,
  cementConsumptionPerCapita: Number,
  countriesInRegion: String,
});

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        customRender: ({text}) => {
            if (!props.countriesInRegion) {
                return text; // Display the text value as-is when countriesInRegion is undefined
            }

            const countryLink = `/gcr/statistics/country/${text}`; // TODO - get proper url
            return h('a', { href: countryLink, class: 'button' }, 'View');
        },
    },
];

let recentStats = [
  {
    key: '1',
    name: 'Consumption (Mt)',
    value: props.consumption + " (e)",
  },
  {
    key: '2',
    name: 'Production (Mt)',
    value: props.production + " (e)",
  },
  {
    key: '3',
    name: 'Export (Mt)',
    value: props.export + " (e)",
  },
  {
    key: '4',
    name: 'Import (Mt)',
    value: props.import + " (e)",
  },
  {
    key: '5',
    name: 'Cement Capacity (Mta)',
    value: props.cementCapacity + " (e)",
  },
];

if (props.cementConsumptionPerCapita > 0) {
  recentStats.push({
    key: '6',
    name: 'Cement Consumption Per Capita (kg)',
    value: props.cementConsumptionPerCapita,
  });
}

if (props.countriesInRegion) {
    recentStats = [];
    props.countriesInRegion.forEach((region, index) => {
        recentStats.push({
            key: index,
            name: region.name,
            value: region.key,
        })
    })
}

console.log(recentStats);
</script>

<template>
  <a-table bordered class="summary-container ant-table-striped"
           :dataSource="recentStats"
           :showHeader="false"
           :pagination="false"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
           size="small"
           :columns="columns">
    <template #title>{{ props.title }}{{ props.year ? ' (' + props.year + ')' : '' }}</template>
  </a-table>
</template>

<style scoped>

.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>