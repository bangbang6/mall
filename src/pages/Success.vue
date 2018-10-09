<!--  -->
<template>
 <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{info.orderId}}</span>
              <span>Order total：{{info.orderTotal}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Model from '@/components/Model'
var axios = require('axios')    


export default {
  data () {
    return {
        info:{}
    };
  },

  components: {
      NavHeader,
      NavFooter,
      NavBread
  },

  computed: {},

  mounted: function(){
      this.init()
  },

  methods: {
      init(){
        var orderListId = this.$route.query.orderId;
        console.log(this.$route)
        axios.post('/users/orderList',{orderListId:orderListId}).then(res=>{
            var res = res.data
            if(res.status == '0'){
                this.info = res.result
            }
        })
      }
  }
}

</script>
<style lang='scss' scoped>
</style>