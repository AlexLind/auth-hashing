const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  // Get the username and password from request body
  const userData = req.body;
  // Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises
  const hash = await bcrypt.hash(userData.password, 10)

  // Save the user using the prisma user model, setting their password to the hashed version
  try {
    const createdUser = await prisma.user.create({
      data: {...userData, password: hash},
    });

      // Respond back to the client with the created users username and id
    res.status(201).json({user: {id: createdUser.id, username: createdUser.username}});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error creating user: " + error.message });
  }


});

module.exports = router;
