const { isValidObjectId } = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateName, validateEmail, validatePassword, validatePhoneNumber } = require("../validators/validator")

const userModel = require("../models/userModel");



class UserController {

  constructor() {
  }


  //=====================================                   ==============================================//
  //                                         Create  User                                                 //
  //=====================================                  ==============================================//


  async createUser(req, res) {

    try {

      let data = req.body

      let { firstName, lastName, emailId, password, phoneNumber } = data

      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: " Body can't be empty. " })
      }

      if (firstName && typeof firstName != "string") {
        return res.status(400).send({ status: false, message: " First name must be in string. " })
      }

      if (!firstName || !firstName.trim()) {
        return res.status(400).send({ status: false, message: " First name must be required or can't be empty. " });
      }

      if (!validateName(firstName)) {
        return res.status(400).send({ status: false, message: " First name is not correct. " });
      }

      if (lastName && typeof lastName != "string") {
        return res.status(400).send({ status: false, message: " Last name must be in string. " })
      }

      if (!lastName || !lastName.trim()) {
        return res.status(400).send({ status: false, message: " Last name must be required or can't be empty. " });
      }

      if (!validateName(lastName)) {
        return res.status(400).send({ status: false, message: " Last name is not correct. " });
      }

      if (emailId && typeof emailId != "string") {
        return res.status(400).send({ status: false, message: " EmailId must be in string. " });
      }

      if (!emailId || !emailId.trim()) {
        return res.status(400).send({ status: false, message: " EmailId must be required or EmailId can't be empty. " });
      }

      if (!validateEmail(emailId)) {
        return res.status(400).send({ status: false, message: " EmailId is not correct. " });
      }
      let checkEmailId = await userModel.findOne({ emailId: emailId })

      if (checkEmailId) {
        return res.status(400).send({ status: false, message: " This emailId is already in use. " })
      }

      if (password && typeof password != "string") {
        return res.status(400).send({ status: false, message: " Password must be in string. " });
      }

      if (!password || !password.trim()) {
        return res.status(400).send({ status: false, message: " Password must be required or Password can't be empty. " });
      }

      if (!validatePassword(password)) {
        return res.status(400).send({ status: false, message: " Password is not correct it contain one upper case , one lower case , one special charchter and numbers with 8-15 charchters. " });
      }

      let hashing = bcrypt.hashSync(password, 8)
      data.password = hashing;
      
      if (!phoneNumber) {
        return res.status(400).send({ status: false, message: " Phone number number must be required or can't be empty. " });
      }

      let checkPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber })

      if (checkPhoneNumber) {
        return res.status(400).send({ status: false, message: " This mobile number is already registred please provide another mobile number. " })
      }

      let createUser = await userModel.create(data)

      return res.status(201).send({ status: false, message: " User register successfully. ", data: createUser })

    } catch (error) {

      return res.status(500).send({ status: false, message: error.message })

    }
  }


  //=====================================                   ==============================================//
  //                                         Login  User                                                 //
  //=====================================                  ==============================================//


  async userLogin(req, res) {

    try {

      let { emailId, password } = req.body

      if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, message: " EmailId and password is required for login. " })
      }

      if (emailId && typeof emailId != "string") {
        return res.status(400).send({ status: false, message: " EmailId must be in string. " });
      }

      if (!emailId || !emailId.trim()) {
        return res.status(400).send({ status: false, message: " EmailId must be required or EmailId can't be empty. " });
      }

      if (!validateEmail(emailId)) {
        return res.status(400).send({ status: false, message: " EmailId is not correct. " });
      }

      if (password && typeof password != "string") {
        return res.status(400).send({ status: false, message: " Password must be in string. " });
      }

      if (!password || !password.trim()) {
        return res.status(400).send({ status: false, message: " Password must be required or Password can't be empty. " });
      }

      if (!validatePassword(password)) {
        return res.status(400).send({ status: false, message: " Password is not correct it contain one upper case , one lower case , one special charchter and numbers . " });
      }

      let verifyUser = await userModel.findOne({ emailId: emailId })

      if (!verifyUser) {
        return res.status(400).send({ status: false, message: " This emailId is not present in your database. " })
      }

      let hash = verifyUser.password;

      let isCorrect = bcrypt.compareSync(password, hash)

      if (!isCorrect) {
        return res.status(400).send({ status: false, message: " Password is incorrect " })
      }

      let payload = ({ userId: verifyUser["_id"] })
      let token = jwt.sign(payload, "Ye ek secrt key h.", { expiresIn: "1h" })

      return res.status(201).send({ status: true, message: " User login successfully. ", token : token });

    } catch (error) {

      return res.status(500).send({ status: false, message: error.message })

    }
  }


  //=====================================                   ==============================================//
  //                                          Get User                                                  //
  //=====================================                  ==============================================//

  async getUser(req, res) {

    try {

        let userId = req.userId

        let getDetails = await userModel.findById(userId)

        if (!getDetails) {
          return res.status(400).send({ status: false, message: " Given userId is not present in your database. " })
        }

        return res.status(200).send({ status: true, message: " Get user detaisl successfully. ", data: getDetails })
 
    } catch (error) {

      return res.status(500).send({ status: false, message: error.message })

    }
  }



  //=====================================                   ==============================================//
  //                                       Update User Data                                               //
  //=====================================                  ==============================================//


  async updateUser(req, res) {

    try {

      let userId = req.userId;

      let data = req.body

      let { firstName, lastName, emailId, password, phoneNumber } = data

      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: " Give some input for updation. " })
      }

      let updatedData = {}

      if (firstName) {

        if (firstName && typeof firstName != "string") {
          return res.status(400).send({ status: false, message: " First name must be in string. " })
        }

        if (!firstName || !firstName.trim()) {
          return res.status(400).send({ status: false, message: " First name must be required or can't be empty. " });
        }

        if (!validateName(firstName)) {
          return res.status(400).send({ status: false, message: " First name is not correct. " });
        }

        firstName = firstName.trim();
        updatedData.firstName = firstName;
      }

      if (lastName) {

        if (lastName && typeof lastName != "string") {
          return res.status(400).send({ status: false, message: " Last name must be in string. " })
        }

        if (!lastName || !lastName.trim()) {
          return res.status(400).send({ status: false, message: " Last name must be required or can't be empty. " });
        }

        if (!validateName(lastName)) {
          return res.status(400).send({ status: false, message: " Last name is not correct. " });
        }

        lastName = lastName.trim();
        updatedData.lastName = lastName;
      }

      if (emailId) {

        if (emailId && typeof emailId != "string") {
          return res.status(400).send({ status: false, message: " EmailId must be in string. " });
        }

        if (!emailId || !emailId.trim()) {
          return res.status(400).send({ status: false, message: " EmailId must be required or EmailId can't be empty. " });
        }

        if (!validateEmail(emailId)) {
          return res.status(400).send({ status: false, message: " EmailId is not correct. " });
        }

        let checkEmailId = await userModel.findOne({ emailId: emailId })

        if (checkEmailId) {
          return res.status(400).send({ status: false, message: " This emailId is already in use. " })
        }

        emailId = emailId.trim();
        updatedData.emailId = emailId;
      }

      if (password) {

        if (password && typeof password != "string") {
          return res.status(400).send({ status: false, message: " Password must be in string. " });
        }

        if (!password || !password.trim()) {
          return res.status(400).send({ status: false, message: " Password must be required or Password can't be empty. " });
        }

        if (!validatePassword(password)) {
          return res.status(400).send({ status: false, message: " Password is not correct it contain one upper case , one lower case , one special charchter and numbers . " });
        }

        password = password.trim();
        let hashing = bcrypt.hashSync("password", 8)
        updatedData.password = hashing;
      }

      if (phoneNumber) {

        if (phoneNumber && typeof phoneNumber != "number") {
          return res.status(400).send({ status: false, message: " Phone number must be in number. " });
        }

        if (!validatePhoneNumber(phoneNumber)) {
          return res.status(400).send({ status: false, message: " Phone number must be in Indain format that start with +91. " });
        }

        let verifyPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber })

        if (verifyPhoneNumber) {
          return res.status(400).send({ status: false, message: " This mobile number is already registred please provide another mobile number. " })
        }

        updatedData.phoneNumber = phoneNumber;
      }

      let updatedUserData = await userModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true })

      return res.status(200).send({ status: true, message: " User detaisl updated sucessfully. ", data: updatedUserData })

    } catch (error) {

      return res.status(500).send({ status: false, message: error.message })

    }
  }


  //=====================================                   ==============================================//
  //                                         Delete User                                                  //
  //=====================================                  ==============================================//


  async deleteUser(req, res) {

    try {

      let userId = req.userId

      let deleteUser = await userModel.findByIdAndUpdate({ _id: userId, isDeleted: false }, { isDeleted: true }, { new: true })

      if (!deleteUser) {
        return res.status(400).send({ status: false, message: " Given userId is not present in your database. " })
      }

      return res.status(200).send({ status: true, message: " User detaisl deleted sucessfully. " })

    } catch (error) {

      return res.status(500).send({ status: false, message: error.message })

    }

  }
}




module.exports = UserController;
