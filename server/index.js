import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/panou.js";
import dotenv from "dotenv";
import User from "./models/signUp.js";
import jwt, {decode} from "jsonwebtoken";
dotenv.config();
const app = express();
app.use("/posts", postRoutes);
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

app.use(cors());
app.use(express.json());
app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
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

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        lname: user.lname,
        email: user.email,
        role: user.role,
      },
      "secret123"
    );
    return res.json({status: "ok", user: token});
  } else {
    return res.json({status: "error", user: false});
  }
});
app.get("/api/admin", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    console.log(decoded.email + " " + decoded.role);
    const email = decoded.email;
    const user = await User.findOne({
      email: email,
    });
    return res.json({status: "ok", role: user.role});
  } catch (e) {
    console.log(err);
    return res.json({status: "error", error: "invalid token"});
  }
});
app.post("/api/admin", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne(
      {
        email: email,
      },
      {$set: {role: req.body.role}}
    );
    return res.json({status: "ok", role: user.role});
  } catch (e) {
    console.log(err);
    return res.json({status: "error", error: "invalid token"});
  }
});

const CONNECTION_URL = process.env.DATABASE_ACCESS;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Sant pregatit😎 : ${PORT} `)))
  .catch((error) => console.log(error.message));
app.listen(4000, () => console.log("Serverul funcioneaza"));
