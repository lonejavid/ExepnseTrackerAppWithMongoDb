const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User=require('../models/user');
const Expense=require('../models/expense')
// const Razorpay = require('razorpay');
// const config = require('../config')
// const jwt = require('jsonwebtoken');
// const { where } = require('sequelize');
// const sequelize = require('../util/database');
// const UserServices=require('../services/userservices')
// const AWS=require('aws-sdk')
// const downloadedFiles=require('../models/downloadedFiles');
// const DownloadedFiles = require('../models/downloadedFiles');

exports.expenses = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
};

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, passwd } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create a new instance of the User model
        const newUser = new User({
            name,
            email,
            phone,
            passwd
        });

        // Save the user to the database
        await newUser.save();

        return res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        console.error('Error in signup:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

function generateAccessToken(email,isprimium){
    return jwt.sign({email,isprimium},'786bismullah745javs234kop0988322bz');
}
exports.login=async(req,res)=>{
    const loginDetails=req.body;
    const email = loginDetails.email;
    const password = loginDetails.password;

    try {
        const user = await User.findOne({ email });
  

        if (user) {
            console.log("the user to login",user)

            const hashedPassword = user.passwd;
            const emailInput=user.email

            // Compare the provided password with the hashed password in the database
             bcrypt.compare(password, hashedPassword,(err,result)=>{
                if(err){
                    throw new Error("something went wrong");
                    
                }
                if(result===true){
                    console.log("check it ",user.isPremium)
                    return res.status(200).json({success:true,message:"user loged in successfully",token:generateAccessToken(emailInput,user.isPremium)})
                }
            });
        }
    }
     catch (error) {
        console.error("Error during login:", error.message);
        return { status: 500, message: "Internal server error" }; // 500 Internal Server Error
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        var id=Object.keys(req.body);
        var id=id[0];
      // Assuming the expense ID is passed as a parameter in the URL
        console.log("expense id is",id)
        // Find the expense by ID and ensure it belongs to the logged-in user
        const expense = await Expense.findOneAndDelete({
            _id: id,
            user: req.user._id // Assuming req.user._id is the ObjectId of the logged-in user
        });

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found or does not belong to this user' });
        }

        res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete expense', error: error.message });
    }
};


exports.getData = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10; // Default page size to 10 if not provided
    try {
        // Fetch expenses for the user
        const expenses = await Expense.find({ user: req.user._id })
                                    
        console.log("these are the user expenses ",expenses)

        res.send(expenses);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
};





exports.goPrimium = async (req, res) => {
    try {
        console.log("testing the code ")
        // Set Razorpay keys
        const RAZORPAY_KEY_ID = 'rzp_test_GAKPWtu92gPjpM';
        const RAZORPAY_KEY_SECRET = '2A6ZKzJtVwKIkz8XLUhmjxGd';
        // Create a new Razorpay instance
        const rzp = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret:RAZORPAY_KEY_SECRET
        });
        const amount = 25000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.error("Razorpay API Error:", err);
                return res.status(500).json({ error: "Error creating Razorpay order" });
            }
            req.user.createOrder({ orderId: order.id, 'status': 'approved' })
                .then(() => {
                    return res.status(200).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    console.error("Error creating user order:", err);
                    return res.status(500).json({ error: "Error creating user order" });
                });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "Unexpected error" });
    }
};
exports.updateTaransaction = async (req, res) => {
    try {
        const { payment_id, order_id,email } = req.body;

        const order = await model.Order.findOne({ where: { orderId: order_id } });
        const promise1 = order.update({ paymentId: payment_id, status: "successfull" });
        const promise2 = req.user.update({ isprimium: true });

        Promise.all([promise1, promise2])
            .then(() => {
                return res.status(200).json({ success: true, message: "transaction successfull" ,token:generateAccessToken(email,true)})
            }).catch((error)=>{
                throw new Error(error)
            })

    } catch (error) {
        console.log("error", error);
    }
};
exports.leadersBoard=async(req,res)=>{
    const laderboardOfusers=await model.User.findAll({

        attributes:['name','totalExpense'],
        order: [['totalExpense', 'DESC']],
        
    })
   
    return res.status(200).json(laderboardOfusers);
}
exports.addExpense = async (req, res) => {
    const data = req.body;
    data.UserEmail = req.user.email; // Assuming req.user.email is set by middleware
    data.user=req.user;
    try {
        // Create the expense
        const expense = await Expense.create(data);
        console.log("expense added into the database",expense)

        // Update the user's totalExpense
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Calculate new totalExpense
        const newTotalExpense = user.totalExpense + expense.amount;

        // Update user's totalExpense
        user.totalExpense = newTotalExpense;
        await user.save();

        // Return success response
        return res.status(200).json({ success: true, expense });

    } catch (error) {
        console.error('Error adding expense:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
exports.download=async(req,res)=>{
    try{
const expenses=await UserServices.getExpenses(req);
const stringifiedExpense=JSON.stringify(expenses);
const userEmail=req.user.email;
const filename=`Expense${userEmail}/${new Date()}.txt`;
const fileurl=await uploadToS3(stringifiedExpense,filename,userEmail);
res.status(200).json({fileurl,success:true});
    }
catch(err){
    console.log(err)
    return res.status(500).json({fileurl:'',success:false,err:err})
}
}


function uploadToS3(data,filename,userEmail){
    let s3bucket=new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET,
    })
        var params={
            Bucket:'expensetracker131',
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log("eror occured while uploading the data",err)
                    reject(err)
                }
                else{
                    const downloadedInfo={
                        filelocation:s3response.Location,
                        UserEmail:userEmail

                    }
                    downloadedFiles.create(downloadedInfo)
                   // console.log("successfully uploaded",s3response.Location);
                    resolve(s3response.Location);
                }
            })
        })    
}


exports.allFiles=async (req,res)=>{
    try{
        const fileLocs=await downloadedFiles.findAll({
            attributes:['filelocation']

        })
        res.status(200).json({fileLocs});

    }
    catch(err){
        console.log("error occured while loading the files from the database")

    }
}