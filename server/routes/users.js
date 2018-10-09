var express = require('express');
var router = express.Router();
var User = require('./../models/users')

var Util = require('./../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',function(req,res,next){
  var param = {
    userName:req.body.userName,
    userPwd :req.body.userPwd
  }
  User.findOne(param,function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
       if(doc){
         res.cookie('userId',doc.userId,{
           path:'/',
           maxAge:1000*60*60
         })
         res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
         //req.session.user = doc
        res.json({
          status:'0',
          msg:"",
          result:{userName:doc.userName}
        })
       }else{

       }
    }
  })
})

router.post("/logout",function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:'',
    result:''
  })
})

router.get('/checkLogin',function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
})

router.get('/cart',function(req,res,next){
  if(req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:'1',
          meg:err.message
        })
      }else{
        var cartList = doc.cartList;
        res.json({
          status:'0',
          meg:"",
          result:cartList
        })
      }
    })
  }
})

router.post('/del',function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
 
  User.update({userId:userId},{$pull:{cartList:{productId:productId}}},function(err,doc){
    if(err){
      res.json({
        status:'1',
        meg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        meg:'',
        result:'suc'
      })
    }
  })
})

router.post('/edit',function(req,res,next){
  var productId = req.body.productId
  var productNum = req.body.productNum
  var userId = req.cookies.userId
  var checked = req.body.checked;
 User.update({userId:userId,"cartList.productId":productId,},{"cartList.$.productNum":productNum,"cartList.$.checked":checked},function(err,doc){
   if(err){
     res.json({
       status:'1',
       msg:err.message
     })
   }else{
    res.json({
      status:'0',
      msg:'',
      result:'suc'
    })
   
 
}
  })
})

router.post('/checkAll',function(req,res,next){
  var checked = req.body.checked;
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,udoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        
      })
    }else{
      udoc.cartList.forEach(item=>{
        item.checked = checked?'1':'0'
      })
      udoc.save(function(err1,savedoc){
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          })
        }
      })
    }
  })
})



router.get('/address',function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,userdoc){
    if(err){
      res.json({
        status:'1',
        mes:err.message
      })
    }else{
      res.json({
        status:'0',
        mes:'',
        result:userdoc.addressList
      })
    }
  })
})


router.post('/setDefaltAddress',function(req,res,next){
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  User.findOne({userId:userId},function(err,userdoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{

      userdoc.addressList.forEach(item =>{
        if(item.addressId == addressId){
          item.isDefault = true
        }else{
          item.isDefault = false
        }
      })
      console.log('uesrdoc address'+ userdoc.addressList)
      userdoc.save(function(err1,doc){
        if(err1){
          res.json({
            status:"1",
            msg:err1.message
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:''
          })
        }
      })
     
    }
  })
})
router.post('/delAddress',function(req,res,next){
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  console.log(addressId)
  User.update({userId:userId},{$pull:{
    "addressList":{
      "addressId":addressId

    }
  }},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        
      })
    }else{
      res.json({
        status:'0',
  
        msg:'',
        result:''
      })
    }
  })
})

router.post('/addDingdan',function(req,res,next){
  var userId = req.cookies.userId
  var addressId =req.body.addressId
  var totleNum = req.body.totleNum

  let address = {};
  let goodsList = []

  //生成orderId以及date
  let sysDate = new Date().Format('yyyyMMddhhmmss');
  var date = new Date().Format('yyyy-MM-dd hh:mm:ss');
   
  let platform = '0709'

  var r1 = Math.floor(Math.random()*10);
  var r2 = Math.floor(Math.random()*10);
   console.log(sysDate)
 var orderId = platform+r1+sysDate+r2;

  User.findOne({userId:userId},function(err,userdoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      userdoc.addressList.forEach(item=>{
        if(item.addressId == addressId){
                 address = item
        }
      })
      userdoc.cartList.forEach(item =>{
        if(item.checked == '1'){
          goodsList.push(item)
        }
      })
      var order = {
        orderId:orderId,
        orderTotal:totleNum,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:date
      }
      userdoc.orderList.push(order)
      userdoc.save(function(err1,doc){
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            
          })
        }else{
          console.log('save suc')
        }
      
      })

      res.json({
         
          status:'0',
          msg:'',
          result:{
            orderId:orderId
          }
        
      })
    }
  })
})

router.post('/orderList',function(req,res,next){
  var orderId = req.body.orderListId;
  var userId = req.cookies.userId
  var order = {};
  User.findOne({userId:userId},function(err,userdoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
      })
    }else{
     userdoc.orderList.forEach(item=>{
       if(item.orderId == orderId){
         console.log(1)
         order = item
       }
     })
     res.json({
      status:'0',
      msg:'',
      result:order
     })
    }
  })
})

module.exports = router;
