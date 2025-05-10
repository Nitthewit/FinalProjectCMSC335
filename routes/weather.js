const express = require("express");
const fetch = require("node-fetch");
const Entry = require("../models/Entry");
const router = express.Router();

const API_KEY = process.env.API_KEY;

router.post("/add", async (req, res) => {
  const { name, city } = req.body;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      return res.send("Error fetching weather (bad response)");
    }

    const weather = data.weather[0].description + ", " + data.main.temp + "°C";
    await Entry.create({ name, city, weather });
    res.redirect(`/result?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&weather=${encodeURIComponent(weather)}`);
  } catch (err) {
    console.error("Fetch error:", err);
    res.send("Error fetching weather (exception)");
  }
});

module.exports = router;
