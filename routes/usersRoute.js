import * as express from "express";
import { body } from "express-validator";
import * as Users from "../api/users.js";
import Register from "../models/users.js";
import Auth from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.get("/allUsers", Auth, Users.allUsers);
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Please! Enter valid Email!")
      .custom((value, { req }) => {
        console.log("value: ", value);
        return Register.findOne({ email: value }).then((data) => {
          if (data) return Promise.reject("Email Already Exist!");
        });
      })
      .normalizeEmail(), // it removes all extra stuff from the email. such as symbols.sign etc.
    body("username")
      .trim()
      .isAlpha()
      .notEmpty()
      .toLowerCase()
      .custom((value, { req }) => {
        console.log("value: ", value);
        return Register.findOne({ username: value }).then((data) => {
          if (data) return Promise.reject("username Already Exist!");
        });
      })
      .isLength({ min: 5, max: 20 })
      .withMessage("Please! Enter valid length username !"),
    body("password")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 8, max: 15 }),
  ],
  Users.createUser
);
router.get("/get/:userId", Auth, Users.getUser);
router.post("/login", Users.logIn);
export default router;
