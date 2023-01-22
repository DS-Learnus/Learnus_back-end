const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerSchema = mongoose.Schema({
  name: {
    type: String,
  },
  company: {
    type: String,
  },
  abv: {
    type: Number,
  },
  intro: {
    type: String,
  },
  ingredient: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
  avgScore: {
    type: Number,
  },
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = { Beer };
