import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import $ from 'jquery'

/*引入Element-UI库*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

/*使用Vuex管理数据*/
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
