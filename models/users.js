import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Register = mongoose.model("Register", RegisterSchema);
export default Register;
