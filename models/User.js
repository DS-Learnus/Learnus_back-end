const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  nikname: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  likeBeers: [
    {
      type: Schema.Types.ObjectId,
      ref: "BeerLike",
    },
  ],
  likeRecipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "BeerReview",
    },
  ],
  userAbv: {
    type: Number,
  },
});

const UserSchema = mongoose.model("UserSchema", userSchema);

module.exports = { UserSchema };
