const express=require('express');
const router=express.Router();
const userauthentication=require('../middleware/auth')
const expense=require('../controllers/expenses')
router.get('/expenses',expense.expenses);
router.post('/signup',expense.signup);
router.post('/login',expense.login);
 router.get('/getData',userauthentication.authenticate,expense.getData);
 router.post('/addExpense',userauthentication.authenticate,expense.addExpense);
// router.get('/goPrimium',userauthentication.authenticate,expense.goPrimium);
// router.post('/updateTaransaction',userauthentication.authenticate,expense.updateTaransaction);
// router.get('/leadersBoard',userauthentication.authenticate,expense.leadersBoard);
 router.post('/deleteExpense',userauthentication.authenticate,expense.deleteExpense);
// router.get('/download',userauthentication.authenticate,expense.download);
// router.get('/allFiles',userauthentication.authenticate,expense.allFiles)
module.exports=router;