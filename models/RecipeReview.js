const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema({
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  score: {
    type: Number,
  },
  content: {
    type: String,
  },
});

const RecipeSchema = mongoose.model("RecipeSchema", recipeSchema);

module.exports = { RecipeSchema };
