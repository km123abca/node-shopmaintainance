const express=require('express');
const router=express.Router();
const inventoryFns=require('./inventorycontrols/getAndPost');

router.get('/',inventoryFns.getAllStuff);
router.get('/x',(req,res)=>{res.render('./public/html/sample.html')})
module.exports=router;