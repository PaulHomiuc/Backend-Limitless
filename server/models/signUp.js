import mongoose from "mongoose";

const signUpTemplate = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "officeadmin", "employee"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Female", "Male", "Other"],
  },
  birthDate: {
    type: Date,
    required: false,
  },
  nationality: {
    type: String,
    required: false,
  },
});
//module.exports = mongoose.model("mytable", signUpTemplate);
export default mongoose.model("mytable", signUpTemplate);
