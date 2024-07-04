const { DataTypes, where } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

exports.User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        primaryKey: false,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isprimium:{
        type:DataTypes.BOOLEAN
    },
    totalExpense:{
        type:DataTypes.INTEGER,
        
    }
});

exports.Expenses=sequelize.define('Expenses',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount:{
        type:DataTypes.DOUBLE,
        allowNull:false

    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    income:{
        type:DataTypes.DOUBLE,
        allowNull:true,
        default:0

    },
    expense:{
        type:DataTypes.DOUBLE,
        allowNull:true,
        default:0

    }
})

exports.ForgotPassword=sequelize.define('forgotpassword',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    active:DataTypes.BOOLEAN
})


exports.Order=sequelize.define('order',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentId:DataTypes.STRING,
    orderId:DataTypes.STRING,
    status:DataTypes.STRING
})


exports.createUser = async (userInfo) => {
    try {
        const email = userInfo.email;
        const existingUser = await exports.User.findByPk(email);

        if (existingUser) {
            return { success: false, message: "User already exists" };
        } else {
            const saltRounds = 10;

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(userInfo.passwd, saltRounds);

            // Save the hashed password to the database
            await exports.User.create({ ...userInfo, passwd: hashedPassword });
            return { success: true, message: "User added successfully" };
        }
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw error; // Re-throw the error for the controller to handle
    }
};
function generateAccessToken(email){
    return jwt.sign({email:email},'786bismullah745javs234kop0988322bz');
}

exports.login = async (loginDetails) => {
    const email = loginDetails.email;
    const password = loginDetails.password;

    try {
        const user = await  exports.User.findByPk(email);
       // console.log("user that i got to apply modifcations",user)

        if (user) {
            const hashedPassword = user.dataValues.passwd;

            // Compare the provided password with the hashed password in the database
             bcrypt.compare(password, hashedPassword,(err,result)=>{
                if(err){
                    throw new Error("something went wrong");
                    
                }
                if(result===true){
                    return res.status(200).json({success:true,message:"user loged in successfully",token:generateAccessToken(user[0].email)})
                }
            });
        }
    }
     catch (error) {
        console.error("Error during login:", error.message);
        return { status: 500, message: "Internal server error" }; // 500 Internal Server Error
    }
};

exports.addExpense=async(userData)=>{
    const result= await exports.Expenses.create(userData);
    return result;
}

exports.deleteExpense=async(id)=>{
    const result=await exports.Expenses.destroy({
        where:{id:id}
     } )
     console.log("result after deletion=",result)
}

exports.getData=async()=>{
    const result = await exports.Expenses.findAll();
    const recordsArray = result.map(record => record.toJSON());
    return recordsArray;
}
// module.exports={User,Expenses}
