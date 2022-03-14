import mongoose from "mongoose";

const deskTemplate = new mongoose.Schema(
  {
    officeName: {
      type: String,
      required: true,
      unique: true,
    },
    building: {
      type: String,
      required: true,
    },
    floorNumber: {
      type: Number,
      required: true,
    },
    totalDesks: {
      type: Number,
      required: true,
    },
    usableDesks: {
      type: Number,
      required: true,
    },
    officeadmin: {
      type: String,
      required: false,
      default:"none"
    },
  },
  {collection: "offices"}
);
export default mongoose.model("mytable2", deskTemplate);
