const { DataTypes, where } = require('sequelize');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');
const ForgotPassword=sequelize.define('forgotpassword',{
    id:{
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey:true
    },
    active:DataTypes.BOOLEAN
})

module.exports=ForgotPassword