const router = require("express").Router();

const ReviewController = require("../controllers/reviewController");
const reviewController = new ReviewController();

const { isAuthenticated } = require("../commanMiddleware/middleware")



/**
 * @route   CREATE /api/review
 * @desc    Create Review
 * @access  Public
 */
router.post("/create/:bookId", isAuthenticated, reviewController.createReview);

/**
 * @route   GET /api/review
 * @desc    Get Review List
 * @access  Public
 */
router.get("/getList/:bookId", isAuthenticated, reviewController.getReviewList);


/**
 * @route   PUT /api/review
 * @desc    Update Review
 * @access  Public
 */
router.put("/update/:reviewId", isAuthenticated, reviewController.updateReview);


/**
 * @route   DELETE /api/review
 * @desc    Delete Review
 * @access  Public
 */
router.delete("/delete/:reviewId", isAuthenticated, reviewController.deleteReview);



module.exports = router;     