
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');


exports.signup = async (req, res, next) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new ErrorResponse("E-mail already registred", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}


exports.signin = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            return next(new ErrorResponse("please add an email", 403));
        }
        if (!password) {
            return next(new ErrorResponse("please add a password", 403));
        }

        //check user email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("invalid credentials", 400));
        }
        //check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("invalid credentials", 400));
        }

        const token = jwt.sign({user}, process.env.JWT_SECRET, {
            expiresIn: "15d",
          });

        // sendTokenResponse(user, 200, res);
        return res.status(200).cookie("token",token, { httpOnly: true, secure: true, maxAge: 3600000 }).json(user);

    } catch (error) {
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    res
        .status(codeStatus)
        .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .json({
            success: true,
            role: user.role
        })
}


// log out
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out"
    })
}


// user profile
exports.userProfile = async (req, res, next) => {

    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({
        success: true,
        user
    })
}




