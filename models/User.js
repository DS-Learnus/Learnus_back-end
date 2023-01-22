const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

userSchema.pre("save", function (next) {
  var user = this;

  // 비밀번호가 변경되었을 때에만 동작하도록 (다른 필드 X)
  if (user.isModified("password")) {
    // 비밀번호를 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // Store hash in your password DB.
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword:   암호화된비밀번호:
  const userPassword = this.password;
  bcrypt.compare(plainPassword, userPassword, function (err, isMatch) {
    if (err) return cb(err);
    console.log(isMatch);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
