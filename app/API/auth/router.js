const express = require("express");
const router = express.Router();
const {
  actionGoogleSignin,
  signup
} = require("./controller");


router.post("/signup", signup);
router.post("/google-login", actionGoogleSignin);

module.exports = router;
