const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User=require('./user')

const expenseSchema = new Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Example: Could be validated further with enum
    income: { type: Number }, // Optional income amount
    expense: { type: Number }, // Optional expense amount
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User model
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
