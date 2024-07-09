<script setup>
import {onBeforeMount, onMounted, inject} from "vue";
import mapData from "@highcharts/map-collection/custom/world.geo.json";

const baseUrl = inject('gcr_base_url');

const props = defineProps({
    dataString: String
});

const chartOptions = {
    chart: {
        map: mapData
    },
    title: {
        text: "Click on a country to access data"
    },
    credits: {
        enabled: false
    },
    // subtitle: {
    //     text:
    //         'TODO some subtitlee txt'
    // },
    mapNavigation: {
        enabled: true,
        buttonOptions: {
            alignTo: "spacingBox"
        }
    },
    // mapView: {
    //     center: [10, 58],
    //     zoom: 2.8
    // },   // TODO dinamicki zumiranje i centriranje u slucaju da se odabere neki region
    colorAxis: {
        min: 0,
        type: 'linear',
        endOnTick: false,
        startOnTick: false,
        labels: {format: '{value} Mt'},
        minColor: '#E6E8FA',
        maxColor: '#83B2E0'
    },
    series: [
        {
            name: "Cement Consumption Data",
            borderColor: "#ccc",
            joinBy: ['iso-a3'],
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                hover: {
                    // color: "#BADA55"
                },
                select: {
                    color: '#A6EDEC',
                    borderColor: 'black',
                    dashStyle: 'shortDot'
                }
            },

            tooltip: {
                valueSuffix: ' (Mt)',
                footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            },
            dataLabels: {
                enabled: false,
                format: "{point.name}"
            },
            point: {
                events: {
                    select: (e) => {
                        window.location.href = baseUrl + "statistics/country/" + e.target.countryUniqueName;
                    }
                }
            },
            data: JSON.parse(props.dataString)
        }
    ]
};

onBeforeMount(() => {
    console.log(props);
    console.log('onBeforeMount');
});

onMounted(() => {

    console.log(props);
    console.log('onMounted');
});

</script>

<template>
    <div id="todo"></div>
    <highcharts
        :constructorType="'mapChart'"
        class="hc world-countries-map-chart box"
        :options="chartOptions"
    ></highcharts>

</template>

<style scoped>
.world-countries-map-chart {
    min-height: 500px;
    margin: 10px 0 40px;
    padding: 10px 0 20px;
}
</style>