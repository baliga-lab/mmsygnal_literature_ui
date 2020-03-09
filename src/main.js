import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import HighchartsVue from 'highcharts-vue'

Vue.config.productionTip = false
Vue.use(HighchartsVue)


new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
