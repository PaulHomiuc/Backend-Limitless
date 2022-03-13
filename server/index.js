import express, {query} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/panou.js";
import dotenv from "dotenv";
import User from "./models/signUp.js";
import Office from "./models/desk-model.js";
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
app.post("/api/officemanage", async (req, res) => {
  try {
    console.log(req.body);
    const office = await Office.create({
      officeName: req.body.officename,
      building: req.body.bname,
      floorNumber: req.body.floornumber,
      totalDesks: req.body.totaldesks,
      usableDesks: req.body.usable,
      officeadmin: req.body.offadm,
    });

    res.json({status: "ok"});
  } catch (err) {
    res.json({status: "error", err: "duplicate office"});
  }
});
app.get("/api/offices", async (req, res) => {
  try {
    const offices = await Office.find();

    res.status(200).json(offices);
    // console.log(offices);
  } catch (err) {
    res.status(404).json({message: err.message});

    console.log(err.message);
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
    // console.log(offices);
  } catch (err) {
    res.status(404).json({message: err.message});

    console.log(err.message);
  }
});
app.post("/api/delete", async (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    console.log(id);
    const users = await User.findByIdAndRemove({_id: id});
    res.json({message: "Post deleted successfully."});
  } catch (err) {
    res.status(404).json({message: err.message});

    console.log(err.message);
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

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  try {
    User.findById(id, (err, user) => {
      res.json(user);
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (!user) {
      res.status(404).send("Todo not found");
    } else {
      user.lastName = req.body.lastName;

      user
        .save()
        .then((user) => {
          res.json(user);
        })
        .catch((err) => res.status(500).send(err.message));
    }
  });
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
