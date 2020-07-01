const express=require('express');
const router=express.Router();
const userFns=require('./usercontrols/getAndPost');


router.get('/register',userFns.register);
router.get('/login',userFns.login);


module.exports=router;
