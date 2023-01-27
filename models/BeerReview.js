const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerReviewSchema = mongoose.Schema(
  {
    beerId: {
      type: Schema.Types.ObjectId,
      ref: "Beer",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const BeerReview = mongoose.model("BeerReview", beerReviewSchema);

module.exports = { BeerReview };
