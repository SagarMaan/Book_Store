const { isValidObjectId } = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateName, validateEmail, validatePassword, validatePhoneNumber, validatePincode, validatePlace } = require("../validators/validator")

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

      let { title, firstName, lastName, emailId, password, phoneNumber, address } = data

      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: " Body can't be empty. " })
      }

      if (title && typeof title != "string") {
        return res.status(400).send({ status: false, message: " Title must be in string. " })
      }

      if (!title || !title.trim()) {
        return res.status(400).send({ status: false, message: " Title must be required or can't be empty. " });
      }

      if (!["Mr.", "Mrs", "Miss"].includes(title.trim())) {
        return res.status(400).send({ status: false, message: " Please use a valid title as Mr,Mrs,Miss. " });
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

      if (phoneNumber && typeof phoneNumber != "number") {
        return res.status(400).send({ status: false, message: " Phone number must be in number. " });
      }

      if (!phoneNumber) {
        return res.status(400).send({ status: false, message: " Phone number number must be required or can't be empty. " });
      }

      if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).send({ status: false, message: " Phone number must be in Indain format that start with +91 and contain 10 digits. " });
      }

      let checkPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber })

      if (checkPhoneNumber) {
        return res.status(400).send({ status: false, message: " This mobile number is already registred please provide another mobile number. " })
      }

      if (address) {

        if (typeof address != "object") {
          return res.status(400).send({ status: false, message: " Value of address must be in JSON format. " });
        }

        let { street, city, pincode } = address;

        if (street && typeof street != "string") {
          return res.status(400).send({ status: false, message: " Street must be in string. " });
        }

        if (!street || !street.trim()) {
          return res.status(400).send({ status: false, message: " Street must be required or Street can't be empty." });
        }

        if (city && typeof city != "string") {
          return res.status(400).send({ status: false, message: " City must be in string. " });
        }

        if (!city || !city.trim()) {
          return res.status(400).send({ status: false, message: " City must be required or city can't be empty. " });
        }

        if (!validatePlace(city)) {
          return res.status(400).send({ status: false, message: " City name is not correct. " });
        }

        if (pincode && typeof pincode != "number") {
          return res.status(400).send({ status: false, message: " Pincode must be in number. " });
        }

        if (!pincode) {
          return res.status(400).send({ status: false, message: " Pincode must be required or pincode can't be empty. " });
        }

        if (!validatePincode(pincode)) {
          return res.status(400).send({ status: false, message: " Pincode is not correct it contains 6 digits. " });
        }

        let savedData = await userModel.create(data)

        return res.status(201).send({ status: true, message: " User created successfully ", data: savedData })

      } else {

        return res.status(400).send({ status: false, message: " Please provide your address. " })

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

      if (req.userId) {

        let userId = req.userId

        let getDetails = await userModel.findById(userId)

        if (!getDetails) {
          return res.status(400).send({ status: false, message: " Given userId is not present in your database. " })
        }

        return res.status(200).send({ status: true, message: " Get user detaisl successfully. ", data: getDetails })
  
      }
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

      let { title, firstName, lastName, emailId, password, phoneNumber, address } = data

      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: " Give some input for updation. " })
      }

      let updatedData = {}
      updatedData.address = {}

      if (title) {

        if (title && typeof title != "string") {
          return res.status(400).send({ status: false, message: " Title must be in string. " })
        }

        if (!title || !title.trim()) {
          return res.status(400).send({ status: false, message: " Title must be required or can't be empty. " });
        }

        if (!["Mr.", "Mrs", "Miss"].includes(title.trim())) {
          return res.status(400).send({ status: false, message: " Please use a valid title as Mr,Mrs,Miss. " });
        }

        title = title.trim();
        updatedData.title = title;
      }

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

      if (address) {

        let checkAddress = await userModel.findById(userId)

        if (typeof address != "object") {
          return res.status(400).send({ status: false, message: " Value of address must be in JSON format. " });
        }

        let { street, city, pincode } = address;

        if (street) {

          if (street && typeof street != "string") {
            return res.status(400).send({ status: false, message: " Street must be in string. " });
          }

          if (!street || !street.trim()) {
            return res.status(400).send({ status: false, message: " Street must be required or Street can't be empty." });
          }

          street = street.trim();
          updatedData.address.street = street;
        } else {

          if (checkAddress.address.street) {

            updatedData.address.street = checkAddress.address.street

          }
        }

        if (city) {

          if (city && typeof city != "string") {
            return res.status(400).send({ status: false, message: " City must be in string. " });
          }

          if (!city || !city.trim()) {
            return res.status(400).send({ status: false, message: " City must be required or city can't be empty. " });
          }

          if (!validatePlace(city)) {
            return res.status(400).send({ status: false, message: " City name is not correct. " });
          }

          city = city.trim();
          updatedData.address.city = city;
        } else {

          if (checkAddress.address.city) {

            updatedData.address.city = checkAddress.address.city

          }
        }

        if (pincode) {

          if (pincode && typeof pincode != "number") {
            return res.status(400).send({ status: false, message: " Pincode must be in number. " });
          }

          if (!validatePincode(pincode)) {
            return res.status(400).send({ status: false, message: " Pincode is not correct. " });
          }

          updatedData.address.pincode = pincode;

        } else {

          if (checkAddress.address.pincode) {

            updatedData.address.pincode = checkAddress.address.pincode

          }
        }

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

      if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: " Given userId is invalid. " })
      }

      // let verifyUser = await userModel.findById( { _id : userId , isDeleted : false } )

      // if ( !verifyUser ) {
      //   return res.status( 400 ).send( { status : false , message : " Given userId is not present in your database. " } )
      // }

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
