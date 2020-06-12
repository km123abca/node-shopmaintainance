var mongoose=require('mongoose');
var Schema  =mongoose.Schema;
var schema 	=new Schema(
				{
				Product_id    :{type:String,required:true},
                            Product_Name  :{type:String,required:true},
                            Product_Desc  :{type:String,required:true},
                            Product_Qty   :{type:Number,required:true},
                            Product_Price :{type:Number,required:true},	
                            Product_Image :{type: String,required:true},
                            Product_Date  :{type:String,default:Date.now()}, 
                            Product_Change_Date:{type:String,default:Date.now()},					
				}
			   );
module.exports =mongoose.model('inventoryitem',schema);