import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/panou.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use("/posts", postRoutes);
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.listen(4000, () => console.log("Serverul funcioneaza"));
app.use(cors());

const CONNECTION_URL = process.env.DATABASE_ACCESS;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Sant pregatit😎 : ${PORT} `)))
  .catch((error) => console.log(error.message));
