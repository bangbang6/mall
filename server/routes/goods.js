var express = require('express')
var  router = express.Router()
var mongoose = require('mongoose')

var Goods = require('../models/goods')

mongoose.connect('mongodb://127.0.0.1:27017/newmall')//连接数据库

mongoose.connection.on('connected',function(){
    console.log('mongo 连成功')
})
mongoose.connection.on('error',function(){
    console.log('mongo 连失败')
})
mongoose.connection.on('disconnected',function(){
    console.log('mongo 断开')
})

router.get("/list",function(req,res,next){
    var page  = Number(req.param('page'));
    var pageSize = Number(req.param('pageSize'))
    var skipNumber = (page - 1)*pageSize
    var sort = req.param("sort")
    var priceLevel = req.param("priceLevel");
    var priceGt = '',priceLte=''
    var params = {}
    if(priceLevel !== "all"){
        switch(priceLevel){
            case '0' :priceGt=0;priceLte=100;break;
            case '1' :priceGt=100;priceLte=500;break;
            case '2' :priceGt=500;priceLte=1000;break;
            case '3' :priceGt=1000;priceLte=5000;break;
        }
         params ={
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    
    var goodsModel = Goods.find(params).skip(skipNumber).limit(pageSize)
    goodsModel.sort({salePrice:sort})
    goodsModel.exec(function(err,doc){
      if(err){
          res.json({
              status:"1",
              msg:err.message
          })
      }else{
          res.json({
              status:"0",
              msg:"",
              result:{
                  count:doc.length,
                  list:doc
              }
          })
      }
  })
})

router.post("/addCart",function(req,res,next){
    var userId = '100000077';
    var goodsId = req.body.productId;//post是body
    console.log(goodsId)    
    var User = require("../models/users")
    User.findOne({userId:userId},function(err,udoc){
      if(err){
          res.json({
              status:'1',
              msg:err.message
          })
      }else{
       console.log('user'+udoc)
       if(udoc){
           var cartList = udoc.cartList;
           console.log('cart'+cartList.length)
           var goodsItem = {}
           console.log('goodsid'+goodsId)
           cartList.forEach(item=>{
               if(item.productId == goodsId){
                goodsItem = item;
                item.productNum ++
               }
               
            })
            if(JSON.stringify(goodsItem) != "{}"){
                    console.log(1)
                 udoc.save(function(err2,doc2){
                     if(err2){
                         res.json({
                             status:'1',
                             msg:err2.message
                         })
                     }else{
                         res.json({
                             status:'0',
                             msg:'',
                             result:'suc'
                         })
                     }
                })
            }else{
                   console.log(2)
                Goods.findOne({productId:goodsId},function(err1,gdoc){
                    if(err1){
                       res.json({
                           status:'1',
                           msg:err1.message
                       })
                    }else{
                        console.log('gdoc'+gdoc)
                        gdoc.productNum = 1;
                        gdoc.checked = 1;
                        udoc.cartList.push(gdoc);
                        console.log( 'udoc Cart'+udoc.cartList)
                        udoc.save(function(err2,doc2){
                           if(err2){
                               res.json({
                                   status:'1',
                                   msg:err2.message
                               })
                           }else{
                               console.log('save suc')
                               res.json({
                                   status:'0',
                                   msg:'',
                                   result:'suc'
                               })
                           }
                        })
                    }
                })
               }
           
        
       }
      }
    })
})
module.exports = router