const mongoose = require("mongoose");
const EntrySchema = new mongoose.Schema({
  name: String,
  city: String,
  weather: String,
});
module.exports = mongoose.model("Entry", EntrySchema);
