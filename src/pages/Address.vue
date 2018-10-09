<!--  -->
<template>
<div>

 <div class="container">
     <nav-header></nav-header>
     <nav-bread>
         <span slot='bread'>address</span>
     </nav-bread>
          <div class="checkout-addr">
            <div class="page-title-normal">
              <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- process step -->
            <div class="check-step">
              <ul>
                <li class="cur"><span>Confirm</span> address</li>
                <li><span>View your</span> order</li>
                <li><span>Make</span> payment</li>
                <li><span>Order</span> confirmation</li>
              </ul>
            </div>

            <!-- address list -->
            <div class="page-title-normal checkout-title">
              <h2><span>Shipping address</span></h2>
            </div>
            <div class="addr-list-wrap">
              <div class="addr-list">
                <ul>
                  <li v-for='(item,index) in fourAddressList' v-bind:class='{"check":checkIndex == index}' @click='checkIndex = index;addressId = item.addressId'>
                    <dl>
                      <dt>{{item.userName}}</dt>
                      <dd class="address">{{item.streetName}}</dd>
                      <dd class="tel">{{item.tel}}</dd>
                    </dl>
                   
                    <div class="addr-opration addr-del">
                      <a href="javascript:;" class="addr-del-btn" @click='delAddress(item.addressId)'> 删除
                        <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                      </a>
                    </div>
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn" v-if='!item.isDefault' @click='setDefalt(item.addressId)'><i>Set default</i></a>
                    </div>
                    <div class="addr-opration addr-default " v-if='item.isDefault'>Default address</div>
                    
                  </li>
                 
                </ul>
              </div>

              <div class="shipping-addr-more">
                <a class="addr-more-btn up-down-btn" href="javascript:;" v-bind:class='{"open":addressFlag}' @click='showAllAddress'>
                  more
                  <i class="i-up-down">
                    <i class="i-up-down-l"></i>
                    <i class="i-up-down-r"></i>
                  </i>
                </a>
              </div>
            </div>

            <!-- shipping method-->
            <div class="page-title-normal checkout-title">
              <h2><span>Shipping method</span></h2>
            </div>
            <div class="shipping-method-wrap">
              <div class="shipping-method">
                <ul>
                  <li class="check">
                    <div class="name">Standard shipping</div>
                    <div class="price">Free</div>
                    <div class="shipping-tips">
                      <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="next-btn-wrap">
              <a class="btn btn--m btn--red" href="#" @click='complete'>Next</a>
            </div>
          </div>
 </div>
    <model v-bind:mdshow='mdshow' v-on:close='close'>
       
        <div slot='btnGroup'>
          <a class='btn btn--m'>地址选择</a>
         <a class='btn btn--m' @click='go'>订单走起</a>
        </div>
      </model>
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
        addressList:[],
        checkIndex :0,
        mdshow:false,
        limit:4,
        addressFlag:false,
        addressId:''
    };
  },

  components: {
      NavHeader,
      NavFooter,
      NavBread,
      Model
  },

  computed: {
      fourAddressList:function(){
          return this.addressList.slice(0,this.limit)
      }
  },

  mounted: function(){
      this.init()
  },

  methods: {
    init(){
        var that = this
        axios.get('/users/address').then(function(res){
            var res = res.data; 
            if(res.status == '0'){
              console.log(res.result)
              that.addressList = res.result
            }
        })
    },
    showAllAddress(){
        if(this.addressFlag ){
             this.limit = 4
        }else{
           
            this.limit = this.addressList.length
        }
     this.addressFlag = !this.addressFlag

    },
    setDefalt(addressId){
        axios.post('/users/setDefaltAddress',{addressId:addressId}).then(res=>{
            var res = res.data;
            if(res.status == '0'){
                console.log('set defalt suc')
            }
        })
        this.init( )
    },
    delAddress(addressId){
      axios.post('/users/delAddress',{addressId:addressId}).then(res=>{
          var res = res.data;
            if(res.status == '0'){
                console.log('set defalt suc')
            }
      })
       this.init( )
    },
    complete(){
      this.mdshow = true
    },
    go(){
        if(this.addressId != ''){
 this.$router.push({path:'/dingdan',query:{addressId:this.addressId}})
        }else return
     
    },
    close(){
        this.mdshow = false
    }
  }
}

</script>
<style lang='scss' scoped>
</style>