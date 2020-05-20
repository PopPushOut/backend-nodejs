const express = require("express");
const router = express.Router();
const errorHandler = require("../public/helpers/errorHandler");
const UserModel = require("../models/UserModel");
/* GET users listing. */
router.get("/", function (req, res) {
  res.render("addUser");
});
router.post(
  "/",
  errorHandler(async (req, res) => {
    let newUser = new UserModel(req.body);
    console.log(newUser);
    let insertedUser = await newUser.save();
    res.json(insertedUser);
  })
);

module.exports = router;
