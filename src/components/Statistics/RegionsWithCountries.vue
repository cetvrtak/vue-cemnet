<script setup>
import {h, inject} from "vue";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons-vue";

const props = defineProps({
    data: String,
})

const baseUrl = inject('gcr_base_url');

const transformedRegionData = transformRegionData(JSON.parse(props.data));

function transformRegionData(regions) {
    const transformedData = [];

    for (const region of regions) {
        const transformedRegion = {
            key: region.id,
            unique_name: region.uniqueName,
            label: region.name,
            children: [],
        };

        if (region.countries && region.countries.length > 0) {
            transformedRegion.children = transformRegionData(region.countries);
        }

        transformedData.push(transformedRegion);
    }

    return transformedData;
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'label',
        key: 'label',
        customRender: ({ text, record }) => {
            if (record.children && record.children.length > 0) {
                const regionLink = baseUrl + `statistics/region/${record.unique_name}`;
                return h('a', { class: 'table-link', href: regionLink }, h('strong', {}, text));
            } else {
                const countryLink = baseUrl + `statistics/country/${record.unique_name}`;
                return h('a', { class: 'table-link', href: countryLink }, `- ${text}`);
            }
        },
    },
    {
        title: 'Value',
        dataIndex: 'key',
        key: 'key',
        customRender: (_) => {
            return '';
        },
    },
];

const customExpandIcon = function (props) {
    if (props.record.children.length === 0) {
        return;
    }

    if (props.expanded) {
        return h('a', { class: 'button', onClick: (e) => props.onExpand(props.record, e) }, ['Hide Countries ', h(MinusOutlined)]);
    } else {
        return h('a', { class: 'button', onClick: (e) => props.onExpand(props.record, e) }, ['Show Countries ', h(PlusOutlined)]);
    }
}

</script>

<template>

    <a-table class="region-table box" :columns="columns" :data-source="transformedRegionData" :expandIconColumnIndex="1"
             :expandIcon="(props) => customExpandIcon(props)" :pagination="false"
             :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    >
    </a-table>
</template>

<style scoped>
.region-table :deep(.table-striped) td {
    background-color: #F9F9F9;
}
</style>