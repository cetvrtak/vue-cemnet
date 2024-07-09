<template>
    <DxDataGrid
            id="gridContainer"
            :customize-columns="customizeColumns"
            :data-source="plants"
            key-expr="plantName"
            :show-borders="true"
    >
        <DxScrolling row-rendering-mode="virtual"/>
        <DxPaging :page-size="10"/>
        <DxPager
                :visible="showPagination.value"
                :allowed-page-sizes="pageSizes"
                display-mode="full"
                :show-page-size-selector="true"
                :show-info="false"
                :show-navigation-buttons="true"
        />
        <DxColumn caption="GroupName"  cell-template="group-cell-template" />
        <DxColumn caption="Company Name" cell-template="company-cell-template" />
        <DxColumn caption="Facility Name" cell-template="plant-cell-template" />
        <DxColumn data-field="city" caption="City"/>
        <DxColumn data-field="typeOfWorks" caption="Type Of Works"/>
        <DxColumn data-field="cementType" caption="Cement Type"/>
        <DxColumn data-field="status" caption="Status"/>
        <template #group-cell-template="{ data }">
            <a :href="data.data.groupUrl">{{data.data.groupName}}</a>
        </template>
        <template #company-cell-template="{ data }">
            <a :href="data.data.companyUrl">{{data.data.companyName}}</a>
        </template>
        <template #plant-cell-template="{ data }">
            <a :href="data.data.plantUrl">{{data.data.plantName}}</a>
        </template>
    </DxDataGrid>
</template>

<script setup>
// TODO dx add too much size to main.js, find out how to optimize
import {onMounted, onBeforeMount, computed, reactive, ref,  inject} from 'vue'
import {
    DxDataGrid,
    DxScrolling,
    DxPager,
    DxPaging,
    DxColumn,
} from "devextreme-vue/data-grid";

const props = defineProps({
    plants: String
});

const showPagination = ref(false)

let plants = [];

const makeUrl = function (slug) {
    return baseUrl + slug;
}
const baseUrl = inject('gcr_base_url');

const customizeColumns = function (columns) {
    // columns[0].width = 70;
}

const minPageSize = 10;

const pageSizes = [minPageSize, 20, 50, 100];

const formatPlants = function (plants) {
    let formattedOutput = [];
  console.log(plants)
    for (let i = 0; i < plants.length; i++) {
        formattedOutput.push({
            plantName: plants[i].name,
            plantUrl: makeUrl("facility/" + plants[i].uniqueName),
            groupName: plants[i].company.parent.name === "" ? plants[i].company.name : plants[i].company.parent.name,
            groupUrl: makeUrl('company/' + (plants[i].company.parent.uniqueName === "" ? plants[i].company.uniqueName : plants[i].company.parent.uniqueName)),
            companyName: plants[i].company.name,
            companyUrl: makeUrl("company/" + plants[i].company.uniqueName),
            city: plants[i].geo.city,
            typeOfWorks: plants[i].typeOfWorks,
            cementType: plants[i].cementType,
            status: plants[i].status
        });
    }

    return formattedOutput;
}

onBeforeMount(() => {
    plants = formatPlants(JSON.parse(props.plants));

    if (plants.length > minPageSize) {
      showPagination.value = true
    }

})

onMounted(() => {
    console.log(`the component is now mounted.`)
})

</script>