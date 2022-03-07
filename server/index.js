import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/panou.js";
import dotenv from "dotenv";
import User from "./models/signUp.js";
dotenv.config();
const app = express();
app.use("/posts", postRoutes);
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

app.use(cors());
app.use(express.json());
app.post("/register", async (req, res) => {
  try {
    //console.log(req.body);
    const user = await User.create({
      firstName: req.body.fname,
      lastName: req.body.lname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      gender: req.body.gender,
      birthDate: req.body.date,
      nationality: req.body.national,
    });

    res.json({status: "ok"});
  } catch (err) {
    res.json({status: "error", err: "duplicate email"});
  }
});
app.post("/login", async (req, res) => {
  const user = await User.FindOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) return res.json({status: "ok", user: true});
  else return res.json({status: "error", user: false});
});

const CONNECTION_URL = process.env.DATABASE_ACCESS;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Sant pregatit😎 : ${PORT} `)))
  .catch((error) => console.log(error.message));
app.listen(4000, () => console.log("Serverul funcioneaza"));
