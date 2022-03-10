import mongoose from "mongoose";
//const mong = require("mongoose");
const signUpTemplate = new mongoose.Schema(
  {
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
    activated: {
      type: Boolean,
      default: true,
    },
  },
  {collection: "users"}
);
//module.exports = mong.model("mytable", signUpTemplate);
export default mongoose.model("mytable", signUpTemplate);
