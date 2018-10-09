<!--  -->
<template>
<div> 

   <nav-header></nav-header>
   <nav-bread><span slot='bread'>Cart List</span></nav-bread>
     <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for='item in cartList'>
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class='{check:item.checked=="1"}' @click='edit("check",item)'>
                      <svg class="icon icon-ok" >
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-bind:src="'/static/'+item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click='edit("minux",item)'>-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click='edit("add",item)'>+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productNum*item.salePrice}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click='del(item.productId)'>删除
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del" ></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
     </div>
    <div>
        <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class='{check:checkALL}' @click='selectAll'>
                      <svg class="icon icon-ok" >
                        <use xlink:href="#icon-ok"></use>
                      </svg>

            全选          
        </a>
       <span>totle Numer : <a>{{totleNum}}</a></span>     </div>
 <div class="btn-wrap"><a class="btn btn--red" v-bind:class="{'btn--dis':cartLength==0}" @click='checkout'>结算</a></div>
<nav-footer></nav-footer>




</div>


 
</template>

<script>

import '@/assets/css/checkout.css'
import Model from '@/components/Model'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
var axios = require('axios')    
export default {
  data () {
    return {
        cartList:[],
        
    };
  },

  components: {
      NavHeader,
      NavFooter,
      NavBread,
      Model
  },

  computed: {
      checkALL(){
          return this.cartLength == this.cartList.length ? true:false
      },
      cartLength(){
          var i =0;
          this.cartList.forEach(item=>{
              if(item.checked == '1'){
                  i++
              }
          })
           return i;
      },
      totleNum(){
          var money =0
          this.cartList.forEach(item=>{
              if(item.checked == '1'){
                  money += parseInt( item.productNum) * parseFloat(item.salePrice)
              }
          })
          return money
      }
     
  },

  mounted: function(){
      this.init()
  },

  methods: {
      init(){
          axios.get('/users/cart').then(res =>{
              var res = res.data;
              if(res.status == '0'){
                  console.log(res.result) ;
                  this.cartList = res.result
                }
          })
      },
      del(productId){
         axios.post('/users/del',{productId:productId}).then(res =>{
               var res = res.data
             if(res.status=='0'){
             this.init()
             
             }
         })
      },
      edit(op,item){
          if(op == 'add'){
              item.productNum ++
          }else if(op == 'minux'){
              if( item.productNum <=1)return;
            item.productNum --
          }else{
              item.checked = item.checked=='1'?'0':'1'
          }
     
      axios.post('users/edit',{productNum:item.productNum,productId:item.productId,checked:item.checked}).then(res =>{
          if(res.status == '0'){
             this.init()
          }
      })
    },
    selectAll(){
        var flag = ! this.checkALL;
        this.cartList.forEach(item=>{
            item.checked =   flag?'1':'0'
        })
        axios.post('/users/checkAll',{checked:flag}).then(res=>{
            if(res.status == '0'){
                console.log('check change suc')
            }
        })
    },
    checkout(){
        if(this.cartLength > 0){
            this.$router.push({path:'/address'})
        }
    }
  }
}

</script>
<style lang='scss' scoped>
</style>