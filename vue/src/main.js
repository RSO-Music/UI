import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import store from './utils/store'
import './assets/css/main.scss'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render(h) {
    return h(App)
  }
}).$mount('#app');
