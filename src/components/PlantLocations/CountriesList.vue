<script setup>
import {inject} from 'vue';

const baseUrl = inject('gcr_base_url');

const countries = [
    {
        name: 'Albania',
        uniqueName: 'albania',
        count: 4,
    },
    {
        name: 'Djibouti',
        uniqueName: 'djibouti',
        count: 12,
    }
]
</script>

<template>
    <h2>Select a country to find related cement plants:</h2>
    <a-row type="flex" justify="start" align="top">
        <a-col :span="24" :sm="12" :lg="12" class="country"
               v-for="country in countries"
               :key="country.uniqueName">
            <a
                target="_blank"
                :href="baseUrl + 'statistics/country/' + country.uniqueName"
            >
                {{ country.name }}
            </a>
            <span>&nbsp;({{ country.count }})</span>
            <!-- TODO slot instead of anchor title-->
        </a-col>
    </a-row>
</template>