const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

// check is user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('You must log in!', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.user);
        req.user = await User.findById(decoded.user._id);
        next();

    } catch (error) {
        console.log(error)
        return next(new ErrorResponse('You must log in!', 401));
    }
}

//middleware for admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role === 0) {
        return next(new ErrorResponse('Access denied, you must an admin', 401));
    }
    next();
}