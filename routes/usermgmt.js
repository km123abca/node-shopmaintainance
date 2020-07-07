const express=require('express');
const { body, validationResult } = require('express-validator');
const router=express.Router();
const userFns=require('./usercontrols/getAndPost');


router.get('/register',userFns.register);
router.get('/login',userFns.login);
router.post('/register',userFns.reg_user);
router.post('/login',
	                  [
	                   body('email').not().isEmpty().trim().escape(),
	                   body('password').not().isEmpty().trim().escape()
	                  ]
	                ,userFns.login_user);
router.get('/logout',userFns.logout);
router.get('/welcome',userFns.welcome);
router.get('/info',userFns.infopage);
router.get('/userinfo',userFns.userInfo);
router.get('/genToken',userFns.genToken);
router.post('/genToken',userFns.genToken_post);

// router.post('/login',userFns.login_user);


module.exports=router;
