import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(vuetify, {
  iconfont:'mdi'
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')