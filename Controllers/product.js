const Product = require("../models/product");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;

    let imageArray = [];
    req.images.forEach(element => {

        const file = {
            filename: element.originalname,
        }

    })
    imageArray.push(file);

    const { name, size, color, price, category, Stock } = req.body;

    console.log(req.file);
    const product = await Product.create({
        name,
        size,
        color,
        price,
        images: imageArray,
        category,
        Stock,
    });

    res.status(201).json({
        success: true,
        product,
    });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.find();
    res.status(200).json({
        success: true,
        product,

    });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});


// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
    });
});



