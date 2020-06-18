const express=require('express');
const router=express.Router();
const salesFns=require('./inventorycontrols/getAndPostSales');


router.get('/',salesFns.getSalesPage);
router.post('/withid',salesFns.getDetailsWithID);
module.exports=router;
