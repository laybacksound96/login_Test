const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.user) {
    res.render("dashboard", { user: req.user });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
