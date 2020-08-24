const jwt = require("jsonwebtoken");
const config = require("config");

//middleware function that has access to req and res cycle
//next is a callback we have to do once we done
//so that we can move on to the next piece of middleware
module.exports = function (req, res, next) {
  // Get token from header
  // when we send req to protected route we need to send the token within a header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  //   try {
  //     const decoded = jwt.verify(token, config.get("jwtSecret"));
  //     // take the req object and assign a value to user
  //     req.user = decoded.user;
  //     // many middleware, go next
  //     next();
  //   } catch (err) {
  //     res.status(401).json({ msg: "Token is not valid" });
  //   }

  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
