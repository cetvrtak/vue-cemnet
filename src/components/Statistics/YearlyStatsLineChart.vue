<script setup>

const props = defineProps({
  title: String,
  // dataString: String
})

const mockData = [{
  name: 'Consumption',
  // data: [[2010, 43934], [2011, 48656], [2012, 65165], [2013, 81827], [2014, 112143], [2015, 142383], [2016, 142383], [2017, 142383]]
  data: [43934, 48656, 65165, 81827, 112143, 142383, 142383, 142383]
}, {
  name: 'Production',
  // data: [[2010, 24916], [2011, 37941], [2012, 29742], [2013, 29851], [2014, 32490], [2015, 30282], [2016, 30282], [2017, 30282]]
  data: [24916, 37941, 29742, 29851, 32490, 30282, 30282, 30282]
}, {
  name: 'Import',
  // data: [[2010, 11744], [2011, 30000], [2012, 16005], [2013, 19771], [2014, 20185], [2015, 24377], [2016, 24377], [2017, 24377]]
  data: [11744, 30000, 16005, 19771, 20185, 24377, 24377, 24377]
}, {
  name: 'Export',
  // data: [[2010, 21908], [2011, 5548], [2012, 8105], [2013, 11248], [2014, 8989], [2015, 11816], [2016, 11816], [2017, 11816]]
  data: [21908, 5548, 8105, 11248, 8989, 11816, 11816, 11816]
}];

const chartOptions = {
  chart: {
    height: 320,
    type: 'line'
  },
  title: {
    text: props.title
  },
  yAxis: {
    title: {
      text: 'Value (Mt)'
    }
  },
  xAxis: {
    type: 'category',
    categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
    startOnTick: true,
    tickWidth: 1
  },
  plotOptions: {
    // series: {
    //   pointStart: 2010
    // }
  },
  series: mockData
};
// TODO add y offset
</script>

<template>
  <highcharts class="hc demand-capacity-chart" :options="chartOptions" ref="chart"></highcharts>
</template>

<style scoped>

</style>