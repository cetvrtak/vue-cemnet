<template>
    <a-table class="plant-details-container"
             :dataSource="plantData"
             :pagination="false"
             size="small"
             :columns="columns">
    </a-table>
</template>

<script setup>
import {Table} from "ant-design-vue";

const props = defineProps({
    name: String,
    company: String,
    group: String,
    city: String,
    state: String,
    country: String,
    status: String,
    cement: String,
    type: String,
    capacity: Number,
});

const columns = [
    {
        title: 'Facility Details',
        className: 'facility-details-title',
        colSpan: 2,
        dataIndex: 'facilityDetails',
        key: 'facilityDetails',
        children: [
            {
                title: 'Name',
                className: 'column-name',
                dataIndex: 'name',
                key: 'name',
                width: 0,
            },
            {
                title: 'Value',
                className: 'column-value',
                dataIndex: 'value',
                key: 'value',
                width: 0,
            },
        ],
    },
];

const plantData = [
    {
        key: '1',
        name: 'Name:',
        value: props.name,
    },
    {
        key: '2',
        name: 'Company:',
        value: props.company,
    },
    {
        key: '3',
        name: 'Group:',
        value: props.group,
    },
    {
        key: '4',
        name: 'City:',
        value: props.city,
    },
    {
      key: '5',
      name: 'State:',
      value: props.state,
    },
    {
        key: '6',
        name: 'Country:',
        value: props.country,
    },
    {
        key: '7',
        name: 'Status:',
        value: props.status,
    },
    {
        key: '8',
        name: 'Cement Type:',
        value: props.cement,
    },
    {
        key: '9',
        name: 'Type Of Works:',
        value: props.type,
    },
    {
        key: '10',
        name: 'Cement Capacity:',
        value: props.capacity,
    },
];
</script>