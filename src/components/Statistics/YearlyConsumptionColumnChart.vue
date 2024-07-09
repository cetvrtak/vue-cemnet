<script setup>
import {onBeforeMount, reactive} from "vue"

// import {inject, onMounted, onUnmounted, ref, reactive, watch, onBeforeMount} from "vue";

const props = defineProps({
  data: String,
});

const items = reactive({value: []});

onBeforeMount(() => {
  // const consumptionData = JSON.parse(props.data);
  items.value = JSON.parse(props.data).map(item => [item.year, item.consumption])
  // console.log("consumptionData", consumptionData)
});

const mockData = [
  ['2016', 631],
  ['2017', 321],
  ['2018', 563],
  ['2019', 753],
  ['2020', 664],
  ['2021', 123],
  ['2022', 354]
];

let chartOptions = {
  chart: {
    height: 320,
    type: 'column'
  },
  title: {
    text: 'World Consumption',
    align: 'center'
  },
  xAxis: {
    type: 'category',
    title: {
      text: null
    },
    gridLineWidth: 0,
    lineWidth: 0
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Mt',
    },
    labels: {
      overflow: 'justify',
      format: '{value} Mt'
    },
    gridLineWidth: 1
  },
  tooltip: {
    valueSuffix: ' (Mt)',
    formatter: function () {
      return `<span>${this.x}</span>: <span style="font-weight: bold">${this.y}</span> <span>[ Mt ]</span>`;
    },
    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    // footerFormat: '</table>',
    // shared: true,
    // useHTML: true
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.label}'
      },
      tooltip: {
        valueSuffix: ' km'
      }
    }
  },
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  series: [{
    name: "Consumption",
    data: JSON.parse(props.data).map(item => [item.year, item.consumption]),
  }]
}
</script>

<template>
  <highcharts class="hc demand-capacity-chart" :options="chartOptions" ref="chart"></highcharts>

</template>

<style scoped>

.demand-capacity-chart {
    margin-bottom: 20px;
}
</style>