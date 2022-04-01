const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/user");
const sendToken = require("../utils/jwtToken");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { Name, Mobile_Number, Email, password } = req.body;
    const userImage = req.file.originalname;
    //  console.log(req.file);




    const user = await User.create({

        Name,
        Mobile_Number,
        Email,
        password,
        userImage,

    });

    sendToken(user, 201, res);


});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { Email, password } = req.body;

    // checking if user has given password and Email both

    if (!Email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ Email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid Email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid Email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});


// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        Name: req.body.Name,
        Mobile_Number: req.body.Mobile_Number,
        userImage: req.file.originalname,



    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        user,
        success: true,
    });
});

// Delete profile
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }


    await user.remove();

    res.status(200).json({
        success: true,
        message: "Profile  Deleted Successfully",
    });
});
// .Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});
