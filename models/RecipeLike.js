const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeLikeSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
});

const RecipeLike = mongoose.model("RecipeLikeSchema", recipeLikeSchema);

module.exports = { RecipeLike };
