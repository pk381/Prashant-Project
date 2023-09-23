const path = require("path");
const rootDir = require("../util/path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

function generateToken(data) {
  return jwt.sign(data, "secretKey");
}

exports.getSignUp = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "sign_up.html"));
};

exports.postSignUp = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user === null) {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
          });

          res.status(201).json({ user: newUser, message: "newUser" });
        }
      });
    } else {
      res.status(201).json({ message: "userExist" });
    }
  } catch (err) {
    res.status(403).json({ message: "error", err: err });
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "login.html"));
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user === null) {
      console.log("user not exist");

      res.status(201).json({ message: "userNotExist" });
    } else {
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (err) {
          res.status(201).json({ message: "passwordIncorrect" });
          console.log(err);
        } else {
          res
            .status(201)
            .json({
              user: user,
              message: "loginSuccessfully",
              token: generateToken(user.id),
            });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "somthing went wrong" });

    console.log(err);
  }
};
