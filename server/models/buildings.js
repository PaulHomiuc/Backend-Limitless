import mongoose from "mongoose";

const buildingTemplate = new mongoose.Schema(
    {
      buildingName:{
          type:String,
          required:true,
          unique:true
      },
      floorsCount:{
          type:Number,
          required:true
      },
      adress:{
          type:String,
          required:true
      },
    },
    {collection: "buildings"}
  );
  export default mongoose.model("mytable3", buildingTemplate);
  