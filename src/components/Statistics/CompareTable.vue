<template>
    <a-col :span="24" :md="12" class="compare-table">
        <h3 :id="props.id" class="region-name">{{ props.data.title }}</h3>
        <a-table class="ant-table-striped"
                 :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                 :dataSource="tableData"
                 :pagination="false"
                 size="small"
                 :columns="columns"
                 bordered
        >
        </a-table>
    </a-col>
</template>

<script setup>
import {ref, onMounted} from "vue";

const props = defineProps({
    id: String,
    data: Array,
})

const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
const columns = [
    {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
    },
    {
        title: 'Consumption',
        dataIndex: 'consumption',
        key: 'consumption',
    },
    {
        title: 'Production',
        dataIndex: 'production',
        key: 'production',
    },
    {
        title: 'Cement Capacity',
        dataIndex: 'cementCapacity',
        key: 'cementCapacity',
    },
    {
        title: 'Export',
        dataIndex: 'export',
        key: 'export',
    },
    {
        title: 'Import',
        dataIndex: 'import',
        key: 'import',
    },
];

const tableData = ref([]);

onMounted(() => {
    const rows = [];
    for (let index = years.length - 1; index >= 0; index--) {
        const year = years[index];
        const row = { key: year, year: year };

        for (const series of props.data.series) {
            const type = series.type;
            row[type.toLowerCase()] = series.data[index].toFixed(3);
        }

        rows.push(row);
    }
    tableData.value = rows;
});
</script>

<style scoped>
.compare-table {
    overflow: auto;
}
.compare-table .ant-table-striped :deep(.table-striped) td {
    background-color: #F9F9F9;
}
.region-name {
    margin: 0;
    padding-bottom: 15px;

    font-family: 'Lato', sans-serif !important;
    font-weight: 800;
    font-size: 21px;
    line-height: 24px;
    text-align: center;
}
#regionName1 {
    color: #7cb5ec;
}
#regionName2 {
    color: #8085e9;
}
</style>