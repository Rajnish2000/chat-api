import { validationResult } from "express-validator";
import Register from "../models/users.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
// const Register = require("../models/users");

const allUsers = async (req, res) => {
  console.log("Its Run Here.");
  await Register.find()
    .then((data) => {
      //   console.log(data);
      if (!data) {
        const error = new Error("data not found !");
        error.statusCode = 404;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "users fetched successfully", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

const createUser = (req, res) => {
  const { email, username, password } = req.body;
  const errors = validationResult(req);
  //   console.log("errors: ", errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "validation data failed!",
      statusCode: 422,
      error: errors.array(),
    });
  }
  bcrypt.hash(password, 12, (err, hash) => {
    // console.log("hash: ", hash);
    const register = new Register({
      email: email,
      username: username,
      password: hash,
    });
    register
      .save()
      .then((data) => {
        res.status(201).json({
          message: "user created Successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const getUser = async (req, res) => {
  try {
    const uid = req.params.userId;
    // console.log("userid : ", uid);
    let data = await Register.findById(uid);
    if (!data) {
      let error = new Error("user Not Found !");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ message: "user found Successfully!", data });
  } catch (err) {
    console.log(err.message);
    if (!err.message) {
      return res.json({
        error: { message: "conflict uid mis-match!", statuscode: 409 },
      });
    }
    return res.json({ error: err.message, statuscode: err.statusCode });
  }
};

// login user
const logIn = async (req, res) => {
  const { username, password } = req.body;
  //   console.log("login credential: ", req.body);
  try {
    let isEqual = await Register.findOne({ username: username }).then(
      async (user) => {
        if (!user) {
          let error = new Error("username not valid | does not exist. ");
          error.statusCode = 401;
          throw error;
        }
        return { valid: await bcrypt.compare(password, user.password), user };
      }
    );
    if (!isEqual.valid) {
      let error = new Error("password InValid | password mismatch");
      error.statusCode = 401;
      throw error;
    }
    console.log(Jwt);
    let token = Jwt.sign(
      {
        email: isEqual.user.email,
        uid: isEqual.user._id,
      },
      "secret-super-key",
      { expiresIn: "1h" }
    );
    //   { algorithm: "RSA256" },
    console.log("token : ", token);
    return res.status(200).json({
      message: "User Logged Successfully! ",
      token,
      user: {
        username: isEqual?.user?.username,
        email: isEqual.user.email,
        id: isEqual.user._id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export { allUsers, createUser, getUser, logIn };
