const mongoose = require("mongoose");

const { dbConfig } = require("./config.js");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/Book_Stor_App?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Mongo DB Connected");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDatabase;
