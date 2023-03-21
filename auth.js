const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/login", passport.authenticate("discord"));
router.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

router.get("/user", (req, res) => {
  res.send(req.user);
});

module.exports = router;
