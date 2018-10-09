let Vuex = require('Vuex')
import mutations from './mutations'
import Vue from 'vue'
Vue.use(Vuex)
let store = new Vuex.Store({
  state:{
      /* cartNum:0, */
      nickName:''
  },
  mutations:mutations
})
export default store
//actions可以异步获取后台数据然后去改变state数据