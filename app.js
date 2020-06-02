const express= require('express');
const morgan=require('morgan');
const err_mid =require('./error_middleware');
const path = require('path');
const inventoryRoutes=require('./routes/inventory');

const app=express();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/inventory',inventoryRoutes);
app.use(err_mid.notFound);
app.use(err_mid.errorHandler);
module.exports=app;