import { createApp } from 'vue'
import axios from "axios";
import "./assets/main.css"

import {
    Row,
    Col,
    Space,
    Tabs,
    Checkbox,
    List,
    ListItem,
    Card,
    Button,
    Form,
    Input,
    Select,
    Anchor,
    AnchorLink,
    Table,
    AnchorProps,
    AnchorLinkProps
} from 'ant-design-vue';
import {
    FormOutlined
} from "@ant-design/icons-vue";
import HighchartsVue from "highcharts-vue";
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import Maps from "highcharts/modules/map";


import InfoCard from './components/Common/InfoCard.vue'

import DemandCapacityChart from './components/PlantLocations/DemandCapacityChart.vue'
import PlantsMap from "./components/PlantLocations/PlantsMap.vue";
import PlantSearch from "./components/PlantLocations/PlantSearch.vue";
import CountriesList from "./components/PlantLocations/CountriesList.vue";
import Summary from "./components/PlantLocations/Summary.vue";
import PlantsTable from "./components/PlantLocations/PlantsTable.vue";
import PlantDetails from "./components/PlantLocations/PlantDetails.vue";
import PlantNewForm from "./components/PlantLocations/PlantNewForm.vue";

import WorldStatsMapChart from "./components/Statistics/WorldStatsMapChart.vue";
import CountriesWithRegionsTable from "./components/Statistics/CountriesWithRegionsTable.vue";
import CountryMap from "./components/Statistics/CountryMap.vue";
import YearlyStatsLineChart from "./components/Statistics/YearlyStatsLineChart.vue";
import RecentStatsTable from "./components/Statistics/RecentStatsTable.vue";
import YearlyConsumptionColumnChart from "./components/Statistics/YearlyConsumptionColumnChart.vue";
// import StatsTable from "./components/Statistics/StatsTable.vue";
import Compare from "./components/Statistics/Compare.vue";
import CompareSelector from "./components/Statistics/CompareSelector.vue";
import CompareTable from "./components/Statistics/CompareTable.vue";
import RegionsWithCountriesTable from "./components/Statistics/RegionsWithCountries.vue";

import Export from "./components/Export/Export.vue";


// TODO import separate style inside component
import 'devextreme/dist/css/dx.light.css';
import 'ant-design-vue/lib/button/style';
import 'ant-design-vue/lib/grid/style';
import 'ant-design-vue/lib/layout/style';
import 'ant-design-vue/lib/tabs/style';
import 'ant-design-vue/lib/checkbox/style';
import 'ant-design-vue/lib/list/style';
import 'ant-design-vue/lib/card/style';
import 'ant-design-vue/lib/form/style';
import 'ant-design-vue/lib/anchor/style';
import 'ant-design-vue/lib/table/style';

// TODO antd Transfer + Steps for export
// window.createApp = createApp;
import { markerAttribute } from './plant-marker.js';
import SelectRegion from "./components/Statistics/SelectRegion.vue";

const gcrBaseUrl = 'http://cemnet.local';

Maps(Highcharts);
// TODO izbaciti export module ?
// Exporting(Highcharts);
// ExportData(Highcharts);

const app = createApp({
    data() {
        return {
            name: 'slavko'
        };
    },
})
    // Register Antd components
    .use(Row)
    .use(Anchor)
    .use(AnchorLink)
    .use(Tabs)
    .use(Col)
    .use(Checkbox)
    .use(Space)
    .use(Card)
    .use(Button)
    .use(List)
    .use(ListItem)
    .use(HighchartsVue)
    .use(Form)
    .use(Input)
    .use(Table)
    .use(Select)
    // Register gcr-app components
    .component('gcr-demand-capacity-chart', DemandCapacityChart)
    .component('gcr-plant-search', PlantSearch)
    .component('gcr-countries-list', CountriesList)
    .component('gcr-plants-table', PlantsTable)
    .component('gcr-summary', Summary)
    .component('gcr-export', Export)
    .component('gcr-plants-map', PlantsMap)
    .component('gcr-country-map', CountryMap)
    .component('gcr-recent-stats-table', RecentStatsTable)
    .component('gcr-yearly-stats-line-chart', YearlyStatsLineChart)
    .component('gcr-yearly-consumption-column-chart', YearlyConsumptionColumnChart)
    .component('gcr-compare-statistics', Compare)
    .component('gcr-compare-selector', CompareSelector)
    .component('gcr-compare-table', CompareTable)
    // .component('gcr-stats-table', StatsTable)
    .component('gcr-world-map-chart', WorldStatsMapChart)
    .component('gcr-plant-details', PlantDetails)
    .component('gcr-countries-with-regions', CountriesWithRegionsTable)
    .component('gcr-regions-with-countries', RegionsWithCountriesTable)
    .component('gcr-select-region', SelectRegion)
    .component('gcr-info-card', InfoCard)
    .component('gcr-plant-new-form', PlantNewForm);


// Api ajax service
const gcrApi = {
    searchPlants: async function(searchQuery) {
        const config = {
            method: 'get',
            baseUrl: gcrBaseUrl,
            headers: {},
            params: {
                action: 'search_plants',
                q: searchQuery
            },
        };

        return axios.get('/wp-admin/admin-ajax.php', config);
    }
};

const helperFn = {
    escapeHtmlString: (htmlStr) => htmlStr.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;"),
    unescapeHtmlString: (htmlStr) => htmlStr.replace(/&lt;/g , "<")
        .replace(/&gt;/g , ">")
        .replace(/&quot;/g , "\"")
        .replace(/&#39;/g , "\'")
        .replace(/&amp;/g , "&")
};

// TODO axios and other common ajax calls shit here
app
    .provide('gcrApi', gcrApi)
    .provide('helperFn', helperFn)
    .provide('gcr_base_url', 'http://localhost/wordpress/gcr/')
    .provide('gcr_gmaps_api_key', 'AIzaSyC8VGgEP8fpAzhM0cn59rfzWyWt6BBYkxM')
    .provide('gcr_assets_url', 'http://cemnet.local/wp-content/plugins/cemnet_gcr/public/assets/')

app.mount('#gcr-app');

window.gcrVueApp = app;

