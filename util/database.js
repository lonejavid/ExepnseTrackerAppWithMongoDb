const Sequelize=require('sequelize');
const sequelize=new Sequelize('expenses','root','0123.qwe.',{
    dialect:'mysql',
    host:'localhost',
    logging:false

})
module.exports=sequelize;