const express = require('express');
const mongoose=require('mongoose')
const app = express();
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'images')));


const expenses = require('./routes/routes');
const resetPasswordRoutes = require('./routes/resetRoutes');
// const { User, Expenses, Order } = require('./models/model');
// const ForgotPassword = require('./models/forgotpasswordDB');
// const downloadedFiles = require('./models/downloadedFiles');

// User.hasMany(Expenses);
// Expenses.belongsTo(User);
// User.hasMany(Order);
// Order.belongsTo(User);
// User.hasMany(ForgotPassword);
// ForgotPassword.belongsTo(User);
// User.hasMany(downloadedFiles);
// downloadedFiles.belongsTo(User);

app.use(expenses);
app.use(resetPasswordRoutes);

mongoose.connect('mongodb+srv://lonejavid:0123.qwe.@cluster0.mlw1j2c.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0').
then(result=>{
    console.log('Connected to MongoDB');
app.listen(3000)
  
}).catch(err=>{
  console.log(err)
})