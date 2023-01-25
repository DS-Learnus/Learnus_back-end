const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeLikeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  },
  { timestamps: true }
);

const RecipeLike = mongoose.model("RecipeLike", recipeLikeSchema);

module.exports = { RecipeLike };
