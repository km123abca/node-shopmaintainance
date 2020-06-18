const express= require('express');
const morgan=require('morgan');
const expressHbs=require('express-handlebars');
const mongoose=require('mongoose');

// mongoose.connect(process.env.DB_CONN_STR,
// 				  {useNewUrlParser:true,useUnifiedTopology:true}
// 				);
mongoose.connect('mongodb://localhost:27017/node-billing',{ useNewUrlParser: true,useUnifiedTopology: true});
const bodyParser=require('body-parser');





const err_mid =require('./error_middleware');
const path = require('path');
const inventoryRoutes=require('./routes/inventory');
const salesRoutes=require('./routes/sales');

const app=express();


app.use(
		(req,res,next)=>
						{
							res.header('Access-Control-Allow-Origin','*');
							res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
							if(req.method==='OPTIONS')
							{
								res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
								return res.status(200).json({}); 
							}
							next(); //so that the flow may continue
						}
	   );






app.engine('.hbs',expressHbs(
	                           {
	                           	defaultLayout:'Layout',
	                           	extname:'.hbs'
	                           }
	                         )
          );
app.set('view engine','.hbs');

// app.engine('.hbs',expressHbs({defaultLayout:'Layout',extname:'.hbs'}));
// app.set('view engine', '.hbs');


app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static('uploads'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use(
// 		(req,res,next)=>
// 						{
// 							res.header('Access-Control-Allow-Origin','*');
// 							res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
// 							if(req.method==='OPTIONS')
// 							{
// 								res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
// 								return res.status(200).json({}); 
// 							}
// 							next(); //so that the flow may continue
// 						}
// 	   );



app.use('/inventory',inventoryRoutes);
app.use('/sales',salesRoutes);
app.use(err_mid.notFound);
app.use(err_mid.errorHandler);
module.exports=app;