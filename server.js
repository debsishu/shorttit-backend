const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ShortUrl = require("./models/shortUrl");
const app = express();

require("dotenv").config();

const DB = process.env.DB_KEY;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

app.get("/", cors(), (req, res) => {
  res.status(200).json("Welcome to Shorttit Backend");
});

app.get("/api/", cors(), async (req, res) => {
  await ShortUrl.create({
    full: req.query.link,
  });
  const shortUrl = await ShortUrl.findOne({ full: req.query.link });
  res.status(201);
  res.json({
    status: "Successful",
    full: shortUrl.full,
    short: shortUrl.short,
    clicks: shortUrl.clicks,
  });
});

app.get("/shortUrl", cors(), async (req, res) => {
  const shortId = req.query.id;
  const shortUrl = await ShortUrl.findOne({ short: shortId });
  if (shortUrl == null) return res.sendStatus(404);
  res.status(200);
  res.json({
    status: "Successful",
    full: shortUrl.full,
    short: shortUrl.short,
    clicks: shortUrl.clicks,
  });
});

app.get("/:shortId", async (req, res) => {
  const short = req.params.shortId;
  const shortUrl = await ShortUrl.findOne({ short: short });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
