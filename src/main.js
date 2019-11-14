import Vue from 'vue'
import App from './app'

/* eslint-disable no-unused-vars */
import router from './router'

// Vue.config.productionTip = false

function createTreemap(elementID) {
  new Vue({
    el: elementID,
    router,
    template: '<App/>',
    components: { App }
  })
}
export { createTreemap }
