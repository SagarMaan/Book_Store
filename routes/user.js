const router = require("express").Router();

const UserController = require("../controllers/userController");
const userController = new UserController();

const { isAuthenticated } = require("../commanMiddleware/middleware")


/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
router.post("/register", userController.createUser);


/**
 * @route   POST api/users
 * @desc    Login User
 * @access  Public
 */
router.post("/login", userController.userLogin);


/**
 * @route   GET api/users
 * @desc    Get User List
 * @access  Public
 */
router.get("/getUser", isAuthenticated, userController.getUser);


/**
 * @route   PUT api/users
 * @desc    Update User Details
 * @access  Public
 */
router.post("/update", isAuthenticated, userController.updateUser);


/**
 * @route   DELETE api/users
 * @desc    Delete User
 * @access  Public
 */
router.delete("/delete", isAuthenticated, userController.deleteUser);



module.exports = router;