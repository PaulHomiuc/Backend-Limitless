import express, {query} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/panou.js";
import dotenv from "dotenv";
import User from "./models/signUp.js";
import Office from "./models/desk-model.js";
import jwt, {decode} from "jsonwebtoken";
import Building from "./models/buildings.js";
import Request from "./models/remote-request.js";
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
app.post("/api/request", async (req, res) => {
  try {
    console.log(req.body);
    const request = await Request.create({
      sender: req.body.sender,
      reason: req.body.reason,
      percent: req.body.percent,
      userId: req.body.id,
    });

    res.json({status: "ok"});
  } catch (err) {
    res.json({status: "error", err: "duplicate office"});
  }
});
app.post("/api/building", async (req, res) => {
  try {
    console.log(req.body);
    const office = await Building.create({
      buildingName: req.body.buildingName,
      floorsCount: req.body.floornumber,
      adress: req.body.adress,
    });

    res.json({status: "ok"});
  } catch (err) {
    console.log(err.message);
    res.json({status: "error", err: "duplicate building"});
  }
});
app.get("/api/buildinget", async (req, res) => {
  try {
    const buildings = await Building.find();

    res.status(200).json(buildings);
    // console.log(offices);
  } catch (err) {
    res.status(404).json({message: err.message});

    console.log(err.message);
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
app.get("/api/getrequests", async (req, res) => {
  try {
    const requests = await Request.find();

    res.status(200).json(requests);
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
app.get("/api/officeadmin", async (req, res) => {
  try {
    const admin = req.body;

    console.log("caca");
    const offices = await Office.findOne({officeadmin: admin});
    console.log(offices);
    res.status(200).json(offices);
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
        id: user._id,
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

  try {
    User.findById(id, (err, user) => {
      res.json(user);
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/updatepercent", (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  console.log("ceva");
  try {
    User.findById(id, (err, user) => {
      if (!user) {
        console.log("eroare");
        res.status(404).send("User not found");
      } else {
        console.log(req.body);
        user.remotePercent = req.body.percent;

        user.markModified("remotePercent");

        user.save();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/requests/:id", async (req, res) => {
  const id = req.params.id;

  try {
    Request.findById(id, (err, request) => {
      res.status(200).json(request);
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/update/:id", (req, res) => {
  const id = req.body.id.id;

  User.findById(id, (err, user) => {
    if (!user) {
      console.log("eroare");
      res.status(404).send("User not found");
    } else {
      // console.log(req.body);
      user.lastName = req.body.lname;
      user.firstName = req.body.fname;
      user.email = req.body.email;
      user.password = req.body.password;
      user.role = req.body.role;
      user.gender = req.body.gender;
      user.birthDate = req.body.date;
      user.nationality = req.body.national;
      user.markModified("lastName");
      user.markModified("firstName");
      user.markModified("email");
      user.markModified("password");
      user.markModified("role");
      user.markModified("gender");
      user.markModified("birthDate");
      user.markModified("nationality");
      user.save();
    }
  });
});

app.post("/deactivate/:id", (req, res) => {
  const id = req.body.id.id;
  User.findById(id, (err, user) => {
    if (!user) {
      console.log("eroare");
      res.status(404).send("User not found");
    } else {
      // console.log(req.body);
      user.activated = !user.activated;
      user.markModified("activated");
      user.save();
    }
  });
});
app.get("/getoffice/:id", async (req, res) => {
  try {
    const offices = await Office.findById(req.params.id);

    res.status(200).json(offices);
    // console.log(offices);
  } catch (err) {
    res.status(404).json({message: err.message});

    console.log(err.message);
  }
});
app.post("/deleteoffice/:id", (req, res) => {
  const id = req.body.id.id;

  Office.findByIdAndRemove(id, (err, office) => {
    if (!office) {
      console.log("eroare");
      res.status(404).send("Office not found");
    } else {
      console.log("sters");
      res.status(200).send("Office removed");
    }
  });
});
app.post("/deleterequest/:id", (req, res) => {
  const id = req.body.id.id;
  console.log(id);
  Request.findByIdAndRemove(id, (err, request) => {
    if (!request) {
      console.log("eroare");
      res.status(404).send("Office not found");
    } else {
      console.log("sters");
      res.status(200).send("Office removed");
    }
  });
});
app.post("/updateoffice/:id", (req, res) => {
  const id = req.body.id.id;

  Office.findById(id, (err, office) => {
    if (!office) {
      console.log("eroare");
      res.status(404).send("User not found");
    } else {
      // console.log(req.body);
      office.officeName = req.body.officename;
      office.building = req.body.building;
      office.floorNumber = req.body.floorNumber;
      office.totalDesks = req.body.totaldesks;
      office.usableDesks = req.body.usabledesks;
      office.officeadmin = req.body.officeadmin;

      office.markModified("officeName");
      office.markModified("building");
      office.markModified("floorNumber");
      office.markModified("totalDesks");
      office.markModified("usableDesks");
      office.markModified("officeadmin");
      office.save();
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
