import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(VueHighcharts, { Highcharts })

new Vue({
  render: h => h(App)
}).$mount('#app')
