const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
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

const RecipeReview = mongoose.model("RecipeReview", recipeSchema);

module.exports = { RecipeReview };
