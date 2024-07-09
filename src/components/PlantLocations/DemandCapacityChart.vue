<template>
    <highcharts class="hc demand-capacity-chart" :options="chartOptions" ref="chart"></highcharts>
</template>

<script setup>

const props = defineProps({
    demand: Number,
    capacity: Number,
});

let chartOptions = {
    chart: {
        height: 320,
        type: 'column'
    },
    title: {
        text: 'Demand/Capacity',
        align: 'center'
    },
    xAxis: {
        categories: ["Demand", "Capacity"],
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
            overflow: 'justify'
        },
        gridLineWidth: 1
    },
    tooltip: {
        valueSuffix: ' [ Mt ]',
        formatter: function () {
            return `<span>${this.x}</span>: <span style="font-weight: bold">${this.y}</span> <span>[ Mt ]</span>`;
        }
    },
    plotOptions: {
        column: {
            grouping: false,
            borderWidth: 0,
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Demand',
        data: [props.demand, 0]
    }, {
        name: 'Capacity',
        data: [0, props.capacity]
    }]
}

</script>