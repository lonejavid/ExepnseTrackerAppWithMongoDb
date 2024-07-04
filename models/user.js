const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwd: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    totalExpense:{type:Number,default:0}
});

// Hash the password before saving to the database
userSchema.pre('save', async function(next) {
    const user = this;
    try {
        const hashedPassword = await bcrypt.hash(user.passwd, 10);
        user.passwd = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
