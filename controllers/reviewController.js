const { isValidObjectId } = require("mongoose");


const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")



class ReviewController {

    constructor() {
    }


    //=====================================                   ==============================================//
    //                                        Create  Review                                                //
    //=====================================                  ==============================================//


    async createReview(req, res) {

        try {

            let userId = req.userId;

            let BookID = req.params.bookId;

            if (!BookID) {
                return res.status(400).send({ status: false, message: " Please provide book id. " })
            }

            if (!isValidObjectId(BookID)) {
                return res.status(400).send({ status: false, message: " Given BookID is invalid. " })
            }

            let verifyBookId = await bookModel.findById({ _id: BookID, isDeleted: false })

            if (!verifyBookId) {
                return res.status(400).send({ status: false, message: " Given BookID is not present in your database. " })
            }

            if (userId != verifyBookId.userId) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }

            let body = req.body;

            let { rating, review } = body


            if (review && typeof review != "string") {
                return res.status(400).send({ status: false, message: " Review must be in string. " });
            }

            if (!review || !review.trim()) {
                return res.status(400).send({ status: false, message: " Review must be present in body and can't be empty. " });
            }

            review = review.trim();

            if (rating && typeof rating != "number") {
                return res.status(400).send({ status: false, message: " Rating must be in number. " });
            }

            rating = parseFloat(rating);

            if (!rating || !(rating <= 10 && rating >= 1)) {
                return res.status(400).send({ status: false, message: " Rating must be present in body and it lie between 1 to 10. " });
            }

            body.reviewer = userId
            body.bookId = BookID
            body.reviewedAt = Date.now();

            const createReview = await reviewModel.create(body);

            return res.status(201).send({ status: true, message: " Successfully created review. ", data: createReview });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }


    //=====================================                   ==============================================//
    //                                       Get Review List                                                //
    //=====================================                  ==============================================//


    async getReviewList(req, res) {

        try {

            let userId = req.userId;

            let BookID = req.params.bookId;

            if (!BookID) {
                return res.status(400).send({ status: false, message: " Please provide book id. " })
            }

            if (!isValidObjectId(BookID)) {
                return res.status(400).send({ status: false, message: " Given BookID is invalid. " })
            }

            let verifyBookId = await bookModel.findById({ _id: BookID, isDeleted: false })

            if (!verifyBookId) {
                return res.status(400).send({ status: false, message: " Given BookID is not present in your database. " })
            }

            if (userId != verifyBookId.userId) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }

            let getReviewList = await reviewModel.find({ bookId: BookID, isDeleted: false })

            return res.status(200).send({ status: true, message: " Successfully get reviews list. ", data: getReviewList });

            // review find krne k teen case honge first uss user ne jitne review kiye h sabhi ko find krna or second ek bookid pr jitne review hue h unhe find krna or third ki ek particular review ko find krna

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }


    //=====================================                   ==============================================//
    //                                       Update   Review                                                 //
    //=====================================                  ==============================================//



    async updateReview(req, res) {

        try {

            let userId = req.userId;

            let reviewId = req.params.reviewId

            if (!isValidObjectId(reviewId)) {
                return res.status(400).send({ status: false, message: " Invalid Review ID. " });
            }

            let verifyReviewId = await reviewModel.findById({ _id: reviewId, isDeleted: false });

            if (!verifyReviewId) {
                return res.status(404).send({ status: false, message: " This Review ID is not exist or might be deleted. " });
            }

            if (userId != verifyReviewId.reviewer) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }

            let body = req.body;

            let updatedData = {}

            let { rating, review } = body

            if (Object.keys(body).length == 0) {
                return res.status(400).send({ status: false, message: " Give some input for updation. " })
            }

            if (rating) {

                if (rating && typeof rating != "number") {
                    return res.status(400).send({ status: false, message: " Rating must be in number. " });
                }

                rating = parseFloat(rating);

                if (!rating || !(rating <= 10 && rating >= 1)) {
                    return res.status(400).send({ status: false, message: " Rating must be present in body and it lie between 1 to 10. " });
                }

                updatedData.rating = rating
            }

            if (review) {

                if (review && typeof review != "string") {
                    return res.status(400).send({ status: false, message: " Review must be in string. " });
                }

                if (!review || !review.trim()) {
                    return res.status(400).send({ status: false, message: " Review must be present in body and can't be empty. " });
                }

                review = review.trim();
                updatedData.review = review
            }

            updatedData.reviewer = userId;
            updatedData.bookId = verifyReviewId.bookId;
            updatedData.reviewedAt = Date.now()


            let updateReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, updatedData, { new: true })

            return res.status(200).send({ status: true, message: " Review data successfully updated. ", data: updateReview });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }



    //=====================================                   ==============================================//
    //                                       Delete   Review                                                 //
    //=====================================                  ==============================================//



    async deleteReview(req, res) {

        try {

            let userId = req.userId;

            let reviewId = req.params.reviewId

            if (!isValidObjectId(reviewId)) {
                return res.status(400).send({ status: false, message: " Invalid Review ID. " });
            }

            let verifyReviewId = await reviewModel.findById({ _id: reviewId, isDeleted: false });

            if (!verifyReviewId) {
                return res.status(404).send({ status: false, message: " This Review ID is not exist or might be deleted. " });
            }

            if (userId != verifyReviewId.reviewer) {
                return res.status(403).send({ status: false, message: " You are not authorized to do this action. " })
            }


            await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true });

            return res.status(200).send({ status: true, message: " Review deleted successfully." });

        } catch (error) {

            return res.status(500).send({ status: false, message: error.message });

        }
    }
}



module.exports = ReviewController