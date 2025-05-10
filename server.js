require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const weatherRoutes = require("./routes/weather");
const Entry = require("./models/Entry");

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/weather", weatherRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/result", (req, res) => {
  const { name, city, weather } = req.query;
  res.send(`
    <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Weather Result</h1>
      <p><strong>${name}</strong>, the current weather in <strong>${city}</strong> is:</p>
      <p style="font-size: 24px;">${weather}</p>
      <button onclick="window.location.href='/'">Home</button>
      <br/><br/>
      <button onclick="window.location.href='/entries'">View Past Entries</button>
    </body>
    </html>
  `);
});

app.get("/entries", async (req, res) => {
  const entries = await Entry.find().sort({ _id: -1 }).limit(10);
  const listItems = entries.map(e => `<li>${e.name} - ${e.city}: ${e.weather}</li>`).join("");

  res.send(`
    <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Last 10 Entries</h1>
      <ul style="list-style:none; padding: 0;">${listItems}</ul>
      <button onclick="window.location.href='/'">Home</button>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server running on port 3000"));
