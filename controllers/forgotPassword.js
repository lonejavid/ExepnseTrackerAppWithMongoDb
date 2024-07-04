const path = require('path');
const model  = require('../models/model');
//const ForgotPassword=require('../models/forgotpasswordDB')
const bcrypt = require('bcrypt');
const config = require('../config')
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const uuid=require('uuid');
const ForgotPassword=require('../models/forgotpasswordDB');



const Sib=require('sib-api-v3-sdk');
const { error } = require('console');
require('dotenv').config();


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
        const transacEmailApi = new Sib.TransactionalEmailsApi();

        const user = await model.User.findOne({ where: { email } });

        if (user) {
            const id = uuid.v4();
            console.log("checking the token ",id)
            
            // Create forgot password entry
            await user.createForgotpassword({ id, active: true });
          
            const sender = {
                email: 'lonejavid07391@gmail.com'
            };

            const receivers = [
                {
                    email: 'javidhumira@gmail.com'
                }
            ];
            // Send email
            await transacEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Testing my application',
                textContent: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`,
            });

            return res.status(200).json({ message: 'Reset link has been sent to the email', success: true });
        } else {
            console.log("this is erro that user does not exist")
            return res.json({ message: 'User does not exist', success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};


exports.resetPassword=(req,res)=>{
     const id =  req.params.id;
    console.log("this is the respose verfication when needed",id)
    // console.log("the id which i got is ",id)
    ForgotPassword.findOne({where:{id:id}}).then(forgotpasswordRequest=>{
        if(forgotpasswordRequest){
            forgotpasswordRequest.update({active:false})
            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called');
                    alert("pass reset successfully")
                }
            </script>
            
            <form action="/updatepassword" method="post">
                <input type="hidden" name="resetpasswordid" value="${id}">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`)
        res.end
        }
        else{
            console.log("no user found",forgotpasswordRequest)
        }
    })
    
}
exports.updatepassword=(req,res)=>{
    const {resetpasswordid,newpassword} = req.body;
    ForgotPassword.findOne({where:{id:resetpasswordid}}).then(resetpasswordrequest=>{
        model.User.findOne({where:{email:resetpasswordrequest.UserEmail}}).then(user=>{
            if(user){
                const saltRounds=10;
                bcrypt.genSalt(saltRounds,function(err,salt){
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    bcrypt.hash(newpassword,salt,function(err,hash){
                        if(err){
                            console.log("error",err);
                            throw new Error(err)
                        }
                        user.update({passwd:hash}).then(()=>{
                            res.redirect('/expenses');
                        })
                    })
                })
            }
            else{
                return res.status(404).json({message:"no user exists"});
            }
        })
    })

}
