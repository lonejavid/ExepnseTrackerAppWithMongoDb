const { DataTypes, where } = require('sequelize');
const sequelize = require('../util/database');
const DownloadedFiles=sequelize.define('downloadedfiles',{
    id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    filelocation:DataTypes.STRING
    
})
module.exports=DownloadedFiles;