import Vue from 'vue'
import Router from 'vue-router'
import Goodlist from '@/pages/Goodlist'
import Cartlist from '@/pages/Cartlist'
import Address from '@/pages/Address'
import Dingdan from '@/pages/Dingdan'
import Success from '@/pages/Success'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Goodlist
    },
    {
      path: '/cart',
      name: 'CartList',
      component: Cartlist
    },
    {
      
        path: '/address',
        name: 'address',
        component: Address
    
    },
    {
      path:'/dingdan',
      name:'Dingdan',
      component:Dingdan
    },
    {
      path:'/success',
      name:'Success',
      component:Success
    }
  ]
})
