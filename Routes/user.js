const express = require("express");
const {
    registerUser,
    loginUser,
    logout,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUser,
    deleteUser,
} = require("../controllers/user");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();
const multer = require('multer');
//const upload = multer({ dest: 'uploads/userImage/' })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/userImage/');
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


//routes
router.post("/user/register", upload.single('userImage'), registerUser);

router.route("/user/login").post(loginUser);


router.route("/user/logout").get(logout);

router.route("/user/me").get(isAuthenticatedUser, getUserDetails);

router.route("/user/password/update").put(isAuthenticatedUser, updatePassword);

router.put("/user/update", upload.single('userImage'), isAuthenticatedUser, updateProfile);

router.route("/user/profile/detele/:id").delete(isAuthenticatedUser, deleteUser);

router.route("/admin/users/").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);



module.exports = router;
