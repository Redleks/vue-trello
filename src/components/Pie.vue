<template>
  <div></div>
</template>

<script>
var Highcharts = require('highcharts')
export default {
  name: 'Pie',
  props: {
    money: {
      type: Array,
      required: true
    },
    devider: {}
  },
  data: function () {
    return {
      target: undefined
    }
  },
  watch: {
    money: {
      handler (newVal, o) {
        this.target.series[0].setData([newVal[0].paid, newVal[0].debt], true)
        this.target.setTitle({
          text: 'Total:' + this.target.series[0].total
        })
        this.target.setSubtitle({
          text: '~' + Math.ceil(this.target.series[0].total / this.devider) + ' rub/m'
        })
      },
      deep: true
    }
  },
  mounted: function () {
    this.target = Highcharts.chart(this.$el, {
      credits: {
        enabled: false
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Total: ' + (this.money[0].paid + this.money[0].debt)
      },
      tooltip: {},
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                'black'
            }
          }
        }
      },
      series: [
        {
          name: 'Money',
          colorByPoint: true,
          data: [
            {
              name: 'Paid',
              y: this.money[0].paid
            },
            {
              name: 'Debt',
              y: this.money[0].debt
            }
          ]
        }
      ]
    })
  },
  beforeDestroy: function () {
    this.target.destroy()
  }
}
</script>
