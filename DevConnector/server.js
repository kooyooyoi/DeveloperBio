const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect Database
connectDB();

// Init Middleware
//used do
// app.use(bodyParser.json());
//now
app.use(express.json());

//single end point to test
//send data to brower
// app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//deploy to Heroku
const PORT = process.env.PORT || 5000;

//pass PORT
//call back if we want sth to happen once it connects
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
