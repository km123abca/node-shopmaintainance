const express=require('express');
const router=express.Router();
const salesFns=require('./inventorycontrols/getAndPostSales');


router.get('/',salesFns.getSalesPage);
router.get('/report',salesFns.salesReport);
router.get('/sreport',salesFns.salesReport_graphic);
router.post('/withid',salesFns.getDetailsWithID);
router.post('/logbill',salesFns.updateBill);
module.exports=router;
