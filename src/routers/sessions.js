const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const userData = req.body;


  const foundUser = await prisma.user.findUnique({
    where: { username: userData.username },
  });

  if (!foundUser) {
    res.status(401).json({ message: "Invalid username or password" });
  }

  const passwordMatch = await bcrypt.compare(
    userData.password,
    foundUser.password
  );

  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid username or password" }); 
  }

  const token = jwt.sign(foundUser.username, process.env.JWT_SECRET);

  res.status(200).json({ token });
});

module.exports = router;
