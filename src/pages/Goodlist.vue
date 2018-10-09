<!-- 
 -->
<template>
    <div>
      
      <nav-header></nav-header>
      <nav-bread><span slot='bread' >Goods</span></nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click='sortGoods'>Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur': priceCheek == 'all'}"  @click="priceCheek = 'all'">All</a></dd>
                <dd v-for="(item,index) in priceFilter" :class="{'cur': priceCheek == index}" @click="setPriceLevel(index)"> 
                  <a href="javascript:void(0)">{{item.begin}} - {{item.end}}</a>
                </dd>
               
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for='(item,index) in goodsList'>
                    <div class="pic">
                      <a href="#"><img v-lazy=" '/static/'+(index+1)+'.jpg' " alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click='addCart(item.productId)'>加入购物车</a>
                      </div>
                    </div>
                  </li>
                  
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                 <img src='/static/loading-svg/loading-bars.svg' v-if='loading'>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <model v-bind:mdshow='mdshow' v-on:close='close'>
        <p slot='message'>添加成功</p>
        <div slot='btnGroup'>
          <a class='btn btn--m'>继续购物</a>
         <router-link class='btn btn--m' to='/cart'>去购物车</router-link>
        </div>
      </model>
     <nav-footer></nav-footer>
    </div>
</template>


<script>
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Model from  '@/components/Model.vue'
var axios = require('axios')    

export default {
  data () {
    return {
        goodsList:[],
        priceFilter:[
            {
                begin:0,
                end:100
            },
            {
                begin:100,
                end:200
            },
            {
                begin:200,
                end:400
            }
        ],
        priceCheek:'all',
        sortFlag:true,
        page:1,
        pageSize:8,
        busy:true,
        loading:false,
        mdshow:false
    };
  },

  components: {
      NavHeader,
      NavFooter,
      NavBread,
      Model
  },

  computed: {},

  mounted: function(){
    this.getGoods(false)
  },

  methods: {
      getGoods(flag){
        var params = {
          page:this.page,
          pageSize:this.pageSize,
           sort:this.sortFlag? 1 : -1,
           priceLevel:this.priceCheek,
        }
        this.loading = true
            axios.get("/goods/list",{params:params}).then(res => {
              console.log("商品",res)
              if(!flag){
                    var res = res.data.result.list;
                    this.goodsList = res;
                    this.busy = false
              }else{
                if( res.data.result.count < this.pageSize){console.log(1);this.busy = true}else{this.busy = false}
                   var res =this.goodsList.concat(res.data.result.list);
                    this.goodsList = res;
                    
              }
              
            }) 
             this.loading = false
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1
        this.getGoods()
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
        this.page ++
        this.busy = false;
        this.getGoods(true)
      }, 500);
    
      
  },
  setPriceLevel(index){
    this.priceCheek = index ;
    this.page = 1;  
    this.getGoods(false)
  },
  addCart(id){
      axios.post('/goods/addCart',{productId:id}).then(res =>{
        console.log(res)
        res = res.data
        if(res.status == 0 ){
          this.mdshow = true
        }else{
          alert('msg'+res.msg)
        }
      })
  },
  close(){
    this.mdshow = false
  }
 }
}
</script>
<style lang='scss' scoped>

</style>