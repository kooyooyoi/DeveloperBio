//use to connect
const mongoose = require("mongoose");
//grab the string in default.json
const config = require("config");
const db = config.get("mongoURI");

//try...catch
//if error like can't connect, show err msg
const connectDB = async () => {
  try {
    // await mongoose.connect(db);
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

//exports the connect to save
module.exports = connectDB;
