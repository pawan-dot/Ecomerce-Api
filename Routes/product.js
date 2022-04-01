const express = require("express");
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,

} = require("../controllers/product");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();
const multer = require('multer');
//const upload = multer({ dest: 'uploads/productImages/' })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/productImages/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.route("/products").get(getAllProducts);

router
    .post("/admin/product/new", upload.array('images'), isAuthenticatedUser, authorizeRoles("admin"), createProduct);


router.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);




module.exports = router;
