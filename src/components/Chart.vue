<template>
  <div></div>
</template>

<script>
var Highcharts = require('highcharts')
export default {
  name: 'Chart',
  props: {
    series: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      target: undefined
    }
  },
  watch: {
    series: function (newVal, oldVal) {
      this.target.series[0].setData(newVal[0].data, true)
      this.target.series[1].setData(newVal[1].data, true)
    }
  },
  mounted: function () {
    this.target = Highcharts.chart(this.$el, {
      credits: {
        enabled: false
      },
      title: {
        text: 'By months'
      },
      hideCredits: true,
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Rub'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} rub</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: this.series
    })
  },
  beforeDestroy: function () {
    this.target.destroy()
  }
}
</script>
