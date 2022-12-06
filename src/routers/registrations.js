const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  const userData = req.body;
  const hash = await bcrypt.hash(userData.password, 10)

  try {
    const createdUser = await prisma.user.create({
      data: {...userData, password: hash},
    });

    res.status(201).json({user: {id: createdUser.id, username: createdUser.username}});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error creating user: " + error.message });
  }


});

module.exports = router;
