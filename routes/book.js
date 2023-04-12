const router = require("express").Router();

const BookController = require("../controllers/bookController");
const bookController = new BookController();

const { isAuthenticated } = require("../commanMiddleware/middleware")



/**
 * @route   CREATE /api/book
 * @desc    Create Book
 * @access  Public
 */
router.post("/create", isAuthenticated, bookController.createBook);



/**
 * @route   GET /api/book
 * @desc    Get Book List
 * @access  Public
 */
router.get("/getList", isAuthenticated, bookController.getBookList);


/**
 * @route   PUT /api/book
 * @desc    Update Book
 * @access  Public
 */
router.put("/update/:bookId", isAuthenticated, bookController.updateBook);


/**
 * @route   DELETE /api/book
 * @desc    Delete Book
 * @access  Public
 */
router.delete("/delete/:bookId", isAuthenticated, bookController.deleteBook);



module.exports = router;