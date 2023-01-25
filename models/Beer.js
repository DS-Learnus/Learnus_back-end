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
  likes: {
    type: Number,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "BeerReview",
    },
  ],
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = { Beer };
