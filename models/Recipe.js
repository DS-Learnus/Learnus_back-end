const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema({
  beerId: {
    type: Schema.Types.ObjectId,
    ref: "Beer",
  },
  content: {
    type: String,
  },
  avgScore: {
    type: Number,
  },
});

const RecipeSchema = mongoose.model("RecipeSchema", recipeSchema);

module.exports = { RecipeSchema };
