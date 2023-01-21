const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerReviewSchema = mongoose.Schema({
  beerId: {
    type: Schema.Types.ObjectId,
    ref: "Beer",
  },
  score: {
    type: Number,
  },
  content: {
    type: String,
  },
});

const BeerReviewSchema = mongoose.model("BeerReviewSchema", beerReviewSchema);

module.exports = { BeerReviewSchema };
