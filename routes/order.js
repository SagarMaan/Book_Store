const router = require("express").Router();

const OrderController = require("../controllers/orderController");
const orderController = new OrderController();

const { isAuthenticated } = require("../commanMiddleware/middleware")



/**
 * @route   Create /api/order
 * @desc    Create Order
 * @access  Public
 */
router.post("/create", isAuthenticated, orderController.createOrder);


/**
 * @route   GET /api/order
 * @desc    Get Order List
 * @access  Public
 */
router.get("/getList", isAuthenticated, orderController.getOrderList);


/**
 * @route   PUT /api/order
 * @desc    Update Order
 * @access  Public
 */
router.put("/update", isAuthenticated, orderController.updateOrder);


/**
 * @route   DELETE /api/order
 * @desc    Delete Order
 * @access  Public
 */
router.delete("/delete", isAuthenticated, orderController.deleteOrder);



module.exports = router;