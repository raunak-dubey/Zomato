const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
// * Require packages
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// * User Controllers
async function registerUser(req, res) {
    const {fullName, email, password, profilePic} = req.body;

    const isUserExists = await userModel.findOne({email});
    if(isUserExists){
        return res.status(400).json({
            message: 'User already exists',
        });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
        profilePic
    });

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token);

    res.status(201).json({
        message: 'User registered successfully',
        user:{
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        },
    });
}

async function loginUser(req, res) {
    const {email, password} = req.body;

    const user = await userModel.findOne({ email });

    if(!user){
        return res.status(400).json({
            message: 'Invalid email or password',
        });
    }
    const isPasswordValid = await bycrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: 'Invalid email or password',
        });
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(201).json({
        message: 'User logged in successfully',
        user:{
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        },
    });
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: 'User logged out successfully',
    });
}

// * Food Partner Controllers
async function registerFoodPartner(req, res) {
    const {name, email, password, phone, contactName, address, profilePic} = req.body;

    const isAccountExits = await foodPartnerModel.findOne({email});
    if(isAccountExits){
        return res.status(400).json({
            message: 'Food Partner already exists',
        });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        contactName,
        address,
        profilePic
    });

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token);

    res.status(201).json({
        message: 'Food Partner registered successfully',
        foodPartner:{
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName,
            profilePic: foodPartner.profilePic
        },
    });
}

async function loginFoodPartner(req, res) {
    const {email, password} = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email });

    if(!foodPartner){
        return res.status(400).json({
            message: 'Invalid email or password',
        });
    }
    const isPasswordValid = await bycrypt.compare(password, foodPartner.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: 'Invalid email or password',
        });
    }
    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(201).json({
        message: 'Food Partner logged in successfully',
        foodPartner:{   
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName,
            profilePic: foodPartner.profilePic
        },
    });
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: 'Food Partner logged out successfully',
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
};