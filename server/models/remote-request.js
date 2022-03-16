import mongoose from "mongoose";

const requestTemplate = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: false,
      enum: ["Accepted", "Rejected", "Pending"],
      default: "Pending",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {collection: "requests"}
);
export default mongoose.model("mytable4", requestTemplate);
