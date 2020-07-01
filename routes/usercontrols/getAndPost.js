const mongoose=require('mongoose');
const w2file=require('../../filesaver');

const register=(req,res)=>{
							res.render('UserMgmt/Register',{title:"Register"});
						  };
const login=(req,res)=>{
						res.render('UserMgmt/Login',{title:"Login"});
					   };
module.exports={
				register,
				login,
			   };