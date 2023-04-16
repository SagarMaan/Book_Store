const router = require("express").Router();

const CartController = require("../controllers/cartController");
const cartController = new CartController();

const { isAuthenticated } = require("../commanMiddleware/middleware")



/**
 * @route   CREATE /api/cart
 * @desc    Create Cart
 * @access  Public
 */
router.post("/create", isAuthenticated, cartController.createCart);


/**
 * @route   GET /api/cart
 * @desc    Get Cart Items List
 * @access  Public
 */
router.get("/getList", isAuthenticated, cartController.getCart);


/**
 * @route   PUT /api/cart
 * @desc    Update Cart
 * @access  Public
 */
router.put("/update/:cartId", isAuthenticated, cartController.updateCart);


/**
 * @route   DELETE /api/cart
 * @desc    Delete Cart
 * @access  Public
 */
router.delete("/clear", isAuthenticated, cartController.clearCart);



module.exports = router;