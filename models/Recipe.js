const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema({
  beerId: {
    type: Schema.Types.ObjectId,
    ref: "Beer",
  },
  ingredient: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  content: {
    type: String,
  },
  avgScore: {
    type: Number,
  },
  likes: {
    type: Number,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = { Recipe };
