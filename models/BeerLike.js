const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerLikeSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  beerId: {
    type: Schema.Types.ObjectId,
    ref: "Beer",
  },
});

const BeerLike = mongoose.model("BeerLikeSchema", beerLikeSchema);

module.exports = { BeerLike };
