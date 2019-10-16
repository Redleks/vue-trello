<template>
  <div id="app">
    <div class="container">
      <div class="loading" v-if="loading">Loading...</div>
      <div class="row">
        <div class="col-12 mt-5">
          <h2>
            Money stats
            <small class="text-muted" style="font-size: 0.4em">{{ year }}</small>
          </h2>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mt-1">
          <select v-model="year" @change="getData">
            <option v-for="year in years" :key="year.id" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-8 mt-5">
          <div id="column">
            <Chart :series="initChart"></Chart>
          </div>
        </div>
        <div class="col-12 col-md-4 mt-5">
          <div id="pie">
            <Pie :money="initPie" :devider="devider"></Pie>
          </div>
        </div>
      </div>
      <footer class="pt-5 my-md-5 pt-md-5">
        <div class="row">
          <div class="col footer-copyright">
            ©
            Powered by VueJS and highcharts.
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Chart from './components/Chart'
import Pie from './components/Pie'

export default {
  components: {
    Chart,
    Pie
  },

  data () {
    return {
      chart: [
        {
          name: 'Paid',
          data: []
        },
        {
          name: 'Debt',
          data: []
        }
      ],
      pie: [{
        paid: 0,
        debt: 0
      }],
      loading: false,
      year: new Date().getFullYear(),
      years: [2018, 2019]
    }
  },

  created () {
    this.getData()
  },

  computed: {
    initChart () {
      return [
        {
          name: 'Paid',
          data: Object.values(this.chart[0].data)
        },
        {
          name: 'Debt',
          data: Object.values(this.chart[1].data)
        }
      ]
    },

    initPie () {
      return this.pie
    },

    devider () {
      if (this.year < (new Date()).getFullYear()) {
        return 12
      } else {
        return (new Date()).getMonth() + 1
      }
    }
  },

  methods: {
    getData () {
      this.loading = true
      this.axios
        .get(
          'https://api.trello.com/1/boards/' +
            BOARD_ID +
            '/cards?key=' +
            VUE_APP_KEY +
            '&token=' +
            VUE_APP_TOKEN
        )
        .then(response => {
          this.loading = false
          let d = []
          let p = []
          let y = this.year
          response.data.forEach(function (item) {
            let money = item.name.split('-')[0].replace(/\s+/g, '')
            if (!isNaN(money)) {
              let month = new Date(item.due).getMonth()
              let year = new Date(item.due).getFullYear()

              // начислено
              if (item.idList === DEBT_ID) {
                if (year === y) {
                  d.push({
                    year: year,
                    month: month,
                    money: Number(money),
                    type: 0
                  })
                }
              }
              // оплачено
              if (item.idList === DEBT_ID) {
                if (year === y) {
                  p.push({
                    year: year,
                    month: month,
                    money: Number(money),
                    type: 1
                  })
                }
              }
            }
          })

          this.chart[0].data = Object.values(this.calc(p))
          this.chart[1].data = Object.values(this.calc(d))

          this.pie[0].paid = Object.values(this.chart[0].data).reduce(function (a, b) { return a + b }, 0)
          this.pie[0].debt = Object.values(this.chart[1].data).reduce(function (a, b) { return a + b }, 0)
        })
    },

    calc (data) {
      const ourCount = {}
      let result = []
      data.forEach(entry => {
        if (!ourCount[entry.month]) {
          ourCount[entry.month] = 0
        }
        ourCount[entry.month] += entry.money
      })
      for (var i = 0; i < 12; i++) {
        result[i] = ourCount[i] ? ourCount[i] : 0
      }
      return result
    }
  }
}
</script>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";
#column,
#pie {
  box-shadow: 0 16px 24px 2px rgba(170, 170, 170, 0.1);
  padding: 10px;
  border-top: 2px solid rgb(250, 250, 250);
}
.loading {
  position: absolute;
  top: 0;
  text-align: center;
  left: 0;
  right: 0;
  background: #ffc107;
  padding: 4px;
  font-size: 12px;
  color: #fff;
}
.footer-copyright {
  font-size: 0.6em;
  color: #666;
}
</style>
