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

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
