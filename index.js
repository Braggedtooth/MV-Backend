const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient()
const port = 3103;

app.get("/", (req, res) => res.send("Good monring sunshine!"));app.listen(port, () => console.log(
  `Example app listening on port ${port}!`


));