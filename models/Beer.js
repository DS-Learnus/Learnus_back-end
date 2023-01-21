const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerSchema = mongoose.Schema({
  name: {
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

const BeerSchema = mongoose.model("BeerSchema", beerSchema);

module.exports = { BeerSchema };
