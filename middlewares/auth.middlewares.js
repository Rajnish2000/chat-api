import jwt from "jsonwebtoken";
import Register from "../models/users.js";

const Auth = async (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");
  //   console.log("token ; ", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized request!" });
  }
  try {
    let decodedToken = jwt.verify(token, "secret-super-key");
    console.log("dec : ", decodedToken);
    const user = await Register.findById({ _id: decodedToken.uid }).select(
      "-username -email -_id"
    );
    if (!user) {
      let error = new Error("Invalid access token");
      error.statusCode = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token! ", error: err });
  }
};

export default Auth;
