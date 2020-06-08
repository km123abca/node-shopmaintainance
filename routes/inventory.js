const express=require('express');
const router=express.Router();
const inventoryFns=require('./inventorycontrols/getAndPost');



//*******************FOR MULTER*****************************
const multer =require('multer');
const storage=multer.diskStorage(
	                              {
	                              	destination:function(req,file,cb){
	                              										cb(null,'./uploads');
	                              								     },
	                              	filename   :function(req,file,cb) 
	                              									{
	                              										var dt=new Date(Date.now()).toLocaleDateString();
	                              										dt=dt.replace(/\/+/g,"_");
	                              										cb(null,dt+file.originalname);
	                              										//Date.toISOString() caused an error
	                              	                                }
	                              	
	                              }

	                            );

const fileFilter=(req,file,cb)=>{
	                            cb(null,true);
	                            /*
								if(file.mimetype=='image/jpg' || file.mimetype=='image/png')
									{
										cb(null,true);
									}
								else 
									    cb(new Error("Not acceptable"),false); //first argument is an error
									*/
							    };
const upload=multer(
	                {
	                 storage:storage,
	                 limits:{
	                 		 fileSize:1024*1024*5
	                        },
	                 fileFilter : fileFilter
	                }
	               );
//*******************END FOR MULTER*****************************



router.get('/',inventoryFns.getAllStuff); 
router.get('/inv_json',inventoryFns.getAllStuff_json);
router.get('/hello',inventoryFns.welcome);
router.post('/',upload.single('Product_Image'),inventoryFns.createNew);
// router.post('/',inventoryFns.createNew);
router.get('/addnew',inventoryFns.addNew);
module.exports=router;