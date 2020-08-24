const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register user
// @access   Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // 1. See if user exists
      // find by email
      let user = await User.findOne({ email });

      if (user) {
        // need return ortherwise it will conflict with
        // res.send("Users registered");
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // 2. Get users gravatar
      const avatar = gravatar.url(email, {
        // avatar requirement
        s: "200",
        r: "pg",
        // default
        d: "mm",
      });

      // create an instance of user
      // pass in an object with some fields
      // just create don't save
      // use user.save to save to the database
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // 3. Encrypt password using bcrypt
      // salt -> do the hashing
      // 10 -> the more you have the more secure but the slower
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // gives us a promise ?? -> use await
      await user.save();

      // 4. Return the json web token
      // res.send("Users registered");
      const payload = {
        user: {
          id: user.id,
        },
      };

      // pass payload and secret
      // expire an hour
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600000 },
        // callback err or token
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      //server error
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
