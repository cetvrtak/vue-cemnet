<script setup>
import {computed, nextTick, ref} from 'vue';

const props = defineProps({
  title: String,
  compareFirst: String,
  compareSecond: String,
  options: String,
});

const mockData = [
    {
        id: 'australasia',
        title: 'Australasia',
        series: [
            {
                type: 'Consumption',
                data: [13.14, 13.16, 11.85, 10.49, 11.19, 11.26, 12.23, 12.73, 13.455, 13.092, 12.843, 13.275, 13.681]
            },
            {
                type: 'Production',
                visible: false,
                data: [10.29, 10.12, 10.17, 10.10, 10.78, 10.88, 11.48, 11.32, 11.733, 11.307, 10.848, 11.193, 11.529]
            }
        ]
    },
    {
        id: 'central-africa',
        title: 'Central Africa',
        series: [
            {
                type: 'Consumption',
                data: [7.94, 8.92, 11.03, 12.97, 14.2, 14.01, 11.6, 10.24, 9.749, 9.692, 10.051, 10.863, 11.57]
            }
        ]
    },
    {
        id: 'central-america',
        title: 'Central America',
        series: [
            {
                type: 'Consumption',
                data: [50.34, 51.65, 53.35, 52.92, 54.95, 58.06, 61.08, 62.19, 61.891, 58.591, 58.384, 60.898, 62.552]
            }
        ]
    }
];

const data = ref([]);
const chartOptions = computed(() => {
    const series = [];
    let title = 'Please select both regions above to display graph.';

    if (data.value[0]?.series && data.value[1]?.series) {
        const regionSeries = [];

        data.value.forEach((item, index) => {
            if (item.series) {
                item.series.forEach((typeData) => {
                    regionSeries.push({
                        name: `${item.title} ${typeData.type}`,
                        visible: typeData.visible,
                        data: typeData.data,
                    });
                });
            }
        });

        if (regionSeries.length > 0) {
            series.push(...regionSeries);
            title = `${data.value[0].title} vs ${data.value[1].title}`;
        }

        nextTick(() => {
            const highchartsRoot = document.querySelector('.highcharts-root');
            if (highchartsRoot) {
                highchartsRoot.classList.add('reset');
            }
        });
    }

    return {
        chart: {
            height: 320,
            type: 'line',
        },
        title: {
            text: title,
        },
        yAxis: {
            title: {
                text: 'Value',
            },
            labels: {
                style: {
                    fontSize: '11px'
                }
            },
        },
        xAxis: {
            title: {
                text: 'Years',
            },
            type: 'category',
            categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
            startOnTick: true,
            tickWidth: 1,
            labels: {
                style: {
                    fontSize: '11px'
                }
            },
        },
        legend: {
            itemStyle: {
                fontWeight: 'bold'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    y: -5,
                }
            }
        },
        series: series,
    };
});

const handleSelectedOption = (selectedOption, selectorIndex) => {
    data.value[selectorIndex] = mockData.find((item) => item.id === selectedOption);
};
</script>

<template>
  <!--  pass countries or regions as prop for select element(s)-->
  <!--  on select change && both select == selected => ajax call for data-->
  <!--  in case click on some link and go back and previous state cleared => use get params in url + only sunc calls -->
    <div class="compare-title-wrapper">
        <h3 class="compare-title">{{ props.title }}</h3>
    </div>
    <div class="compare-chart-container box">
        <a-row class="compare-chart-selectors">
            <compare-selector :title="compareFirst" :options="props.options" :index="0" @selectedOption="handleSelectedOption"></compare-selector>
            <compare-selector :title="compareSecond" :options="props.options" :index="1" @selectedOption="handleSelectedOption"></compare-selector>
        </a-row>
        <highcharts class="compare-chart" :options="chartOptions" ref="chart"></highcharts>
    </div>

    <a-row class="compare-tables-container box">
        <gcr-compare-table v-if="data[0]" id="regionName1" :data="data[0]"></gcr-compare-table>
        <gcr-compare-table v-if="data[1]" id="regionName2" :data="data[1]"></gcr-compare-table>
    </a-row>
</template>

<style scoped>
.compare-title-wrapper {
    margin: 10px 0;
}
.compare-title {
    margin: 0;

    font-family: 'Lato', sans-serif !important;
    font-weight: 800;
    font-size: 21px;
    line-height: 24px;
    letter-spacing: -.5px;
    color: #3289af;
}
.compare-chart-container {
    margin-bottom: 30px;
}
.compare-tables-container {
    overflow: auto;
}
</style>