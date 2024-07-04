const express=require('express');
const router=express.Router();

const passwordReset=require('../controllers/forgotPassword')
router.post('/forgotPassword',passwordReset.forgotPassword);
router.get('/resetpassword/:id',passwordReset.resetPassword);
router.post('/updatepassword',passwordReset.updatepassword)
module.exports=router;