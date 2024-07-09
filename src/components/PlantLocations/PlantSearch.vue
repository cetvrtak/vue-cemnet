<template>
    <div>
        <h2>Search for a plant or company</h2>

            <a-auto-complete
                v-model:value="state.query"
                class="certain-category-search"
                placeholder="Enter plant or company name"
                dropdown-class-name="certain-category-search-dropdown"
                :dropdown-match-select-width="500"
                style="width: 250px;"
                :options="state.results"
                @search="handleSearch"
            >
                <template #option="item">
                    <template v-if="item.options">
                        <span>{{ item.value }}</span>
                    </template>
                    <template v-else>
                        <div style="display: flex; justify-content: space-between">
                            <a
                                :href="item.url"
                                rel="noopener noreferrer"
                            >
                                {{ item.value }}
                            </a>
                        </div>
                    </template>
                </template>
            </a-auto-complete>
    </div>
</template>

<script setup>
import {inject, ref, reactive} from "vue";

const gcrApi = inject('gcrApi');

const baseUrl = inject('gcr_base_url');

let timerId = null;

let state = reactive({
    query: '',
    results: [],
    fetching: false,
    showAll: false
});

const getFullUrl = function (slug) {
    return baseUrl + slug;
}

const formatResponse = function (response) {
    let plants = response.filter(p => p.plantName.toLowerCase().includes(state.query.toLowerCase())).map(p => {
        return {
            value: p.plantName,
            url: getFullUrl("facility/" + p.plantUniqueName)
        }
    });

    let companyGroups = response.filter(p => p.company.parent.name.toLowerCase().includes(state.query.toLowerCase())).map(p => {
        return {
            value: p.company.parent.name,
            url: getFullUrl("company/" + p.company.parent.uniqueName)
        }
    });

    return [
        {
            value: "Matching Plants",
            options: plants
        },
        {
            value: "Matching Companies",
            options: companyGroups
        }
    ];
}

const onSelectHandler = function () {

}

const showAllResults = function () {
    console.log('showAllResults')
    state.showAll = true;
}

const hideAllResults = function () {
    state.showAll = false;
}

const handleSearch = function() {
    // hideAllResults();

    if (timerId) {
        clearTimeout(timerId);
    }
    // TODO handle throttling

    if (state.query.length > 2) {

        timerId = setTimeout(() => {
            state.fetching = true;

            gcrApi.searchPlants(state.query)
                .then( response => {
                    state.results = formatResponse(response.data);
                    state.fetching = false;
                })
                .catch( error => {
                    console.log(error);
                    state.fetching = false;
                })
        }, 700);
    } else {
        state.results = [];
    }
}

</script>

<style scoped>

</style>