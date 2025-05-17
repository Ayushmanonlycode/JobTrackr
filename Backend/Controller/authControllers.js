const userModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.getRegister = async(req, res) => {
    const{ name, email, password,confirmpassword } = req.body;
    const isValid = validateCredentials(name, email, password, confirmpassword);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userModel.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.cookie('token', token, {httpOnly: true});
        res.status(201).json({ message: 'User created successfully', token });
}catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }   
}


module.exports.getLogin = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, {httpOnly: true});
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.getLogout = async(req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.getProfile = async(req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

function validateCredentials(name, email, password, confirmpassword) {
    if (!name || !email || !password || !confirmpassword) {
        return false;
    }
    if (password !== confirmpassword) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    return true;
}
