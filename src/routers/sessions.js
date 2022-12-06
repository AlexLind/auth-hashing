const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  // Get the username and password from the request body
  const userData = req.body;

  // Check that a user with that username exists in the database

  const foundUser = await prisma.user.findUnique({
    where: { username: userData.username },
  });

  if (!foundUser) {
    res.status(401).json({ message: "Invalid username or password" });
  }

  // Use bcrypt to check that the provided password matches the hashed password on the user
  const passwordMatch = await bcrypt.compare(
    userData.password,
    foundUser.password
  );

  // If either of these checks fail, respond with a 401 "Invalid username or password" error
  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid username or password" });
  }

  // If the user exists and the passwords match, create a JWT containing the username in the payload
  // Use the JWT_SECRET environment variable for the secret key

  const token = jwt.sign(foundUser.username, process.env.JWT_SECRET);

  // Send a JSON object with a "token" key back to the client, the value is the JWT created
  res.status(200).json({ token });
});

module.exports = router;
