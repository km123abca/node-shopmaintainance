const productsx=require('../../models/productsx');
const mongoose=require('mongoose');
const w2file=require('../../filesaver');

const getSalesPage=(req,res)=>{
								res.render('Sales/salesfront');
						      };
module.exports={
				 getSalesPage,
			   };