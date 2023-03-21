const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.user) {
    res.send({ user: req.user });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
