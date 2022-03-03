import express from "express";

import {getPosts} from "../controllers/panou.js";

const router = express.Router();
//localhost: 5000 / posts;
//router.get("/", getPosts);
//import signUpTemplate from "./models/signUp.js";
import signUpTemplateCopy from "../models/signUp.js";

router.post("/signup", (request, response) => {
  const signedUpUser = new signUpTemplateCopy({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
    role: request.body.role,
    gender: request.body.gender,
    birthDate: request.body.birthDate,
    nationality: request.body.nationality,
  });
  signedUpUser
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((err) => {
      response.json(err);
    });
});
router.get("/login");
//module.exports = router;
export default router;
