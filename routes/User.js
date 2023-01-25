const express = require("express");
const mongoose = require("mongoose");
const { Beer } = require("../models/Beer");
const router = express.Router();
const { User } = require("../models/User");
const { BeerLike } = require("../models/BeerLike");
const { Recipe } = require("../models/Recipe");
const { RecipeLike } = require("../models/RecipeLike");

// 회원가입 - post
router.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo,
    });
  });
});

// 로그인 - post
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "메일에 해당하는 유저가 없습니다.",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      res.status(200).json({ loginSuccess: true, user });
    });
  });
});

// 사용자 정보 불러오기
router.get("/mypage/:userId", async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  //console.log(userId);
  try {
    // 사용자 정보
    console.log("실행1");
    User.findOne({ _id: userId }, { _id: -1 }, async (err, userInfo) => {
      const myLikeBeers = await Beer.find({}, { name: 1 }).or([
        { beerId: userInfo.likeBeers[0] },
        { beerId: userInfo.likeBeers[1] },
        { beerId: userInfo.likeBeers[2] },
      ]);

      const myLikeRecipes = await Recipe.find().or([
        { recipeId: userInfo.likeRecipes[0] },
        { recipeId: userInfo.likeRecipes[1] },
        { recipeId: userInfo.likeRecipes[2] },
      ]);

      if (err)
        res
          .status(400)
          .json({ success: false, message: "False to load a like data", err });

      return res.status(200).json({
        success: true,
        message: "Success to load User info!",
        myLikeBeers,
        myLikeRecipes,
      });
    })
      .populate({
        path: "likeRecipes.recipeId",
        model: "RecipeLike",
        select: "likeRecipes",
      })
      .populate({
        path: "likeBeers.beerId",
        model: "BeerLike",
        select: "likeBeers",
      });
    // 배열에 좋아요한 주류, 주류 레시피 각각 넣기
    //console.log("실행2");
    // let beerId;
    // let recipeId;
    // let userlikeBeers = new Array(0);
    // let userlikeRecipes = new Array(0);
    // console.log(user.likeBeers.length);
    // console.log("실행1");

    // for (i = 0; i < user.likeBeers.length; i++) {
    //   console.log("실행2");
    //   BeerLike.findOne({ _id: user.likeBeers[i]._id }, async (err, beers) => {
    //     beerId = beers.beerId;
    //     console.log("beerId " + beerId);

    //     Beer.findOne({ _id: beerId }, (err, beers) => {
    //       userlikeBeers.push(beers);
    //       //console.log(userlikeBeers);
    //     });
    //   });
    // }
    // for (i = 0; i < user.likeRecipes.length; i++) {
    //   console.log("실행3");
    //   RecipeLike.findOne({ _id: user.likeRecipes[i]._id }, (err, recipes) => {
    //     recipeId = recipes.recipeId;
    //     //console.log("recipeId " + recipeId);

    //     Recipe.findOne({ _id: recipeId }, (err, recipes) => {
    //       userlikeRecipes.push(recipes);
    //       // console.log(userlikeRecipes);

    //       if (err)
    //         return res
    //           .status(400)
    //           .json({ success: true, message: "False to load user data!" });
    //     });
    //   });
    // }
    // console.log("실행4");
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "False to load User Info!", err });
  }
});

// 주류 좋아요 기능 - post
router.post("/likeBeer", async (req, res) => {
  // beerId, UserId 받기
  try {
    const beerId = req.body.beerId;
    const userId = req.body.userId;

    // 1. Beer에 likes +1
    Beer.updateOne({ _id: beerId }, { $inc: { likes: 1 } }, (err, beerInfo) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "False to update to like." });
    });

    // 2. userId 넣어서 BeerLike 생성
    console.log("생성1");
    const newBeerLike = new BeerLike({ beerId: beerId, userId: userId });
    newBeerLike.save((err, likeInfo) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "False to make a like." });

      // 3. BeerLike의 id를 User의 likeBeers에 넣기
      const beerLikeId = likeInfo._id;
      console.log("생성2:" + beerLikeId);
      User.updateOne(
        { _id: userId },
        { $push: { likeBeers: beerLikeId } },
        (err, userInfo) => {
          if (err)
            return res
              .status(400)
              .json({ success: false, message: "False to update user like" });

          return res.status(200).json({
            success: true,
            message: "Success to update user like.",
            userInfo,
          });
        }
      );

      // return res.status(200).json({
      //   success: true,
      //   message: "Success to make a like.",
      //   likeInfo,
      // });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Error code!", err });
  }
});

// 주류 레시피 좋아요 기능 - post
router.post("/likeRecipe", async (req, res) => {
  // recipeId, UserId 받기
  try {
    const recipeId = req.body.recipeId;
    const userId = req.body.userId;

    // 1. Recipe에 likes +1
    Recipe.updateOne(
      { _id: recipeId },
      { $inc: { likes: 1 } },
      (err, recipeInfo) => {
        if (err)
          return res
            .status(400)
            .json({ success: false, message: "False to update to like." });
      }
    );

    // 2. userId 넣어서 RecipeLike 생성
    console.log("생성1");
    const newRecipeLike = new RecipeLike({
      recipeId: recipeId,
      userId: userId,
    });
    newRecipeLike.save((err, likeInfo) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "False to make a like." });

      // 3. BeerLike의 id를 User의 likeBeers에 넣기
      const recipeLikeId = likeInfo._id;
      console.log("생성2:" + recipeLikeId);
      User.updateOne(
        { _id: userId },
        { $push: { likeRecipes: recipeLikeId } },
        (err, userInfo) => {
          if (err)
            return res
              .status(400)
              .json({ success: false, message: "False to update user like" });

          return res.status(200).json({
            success: true,
            message: "Success to update user like.",
            userInfo,
          });
        }
      );

      // return res.status(200).json({
      //   success: true,
      //   message: "Success to make a like.",
      //   likeInfo,
      // });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Error code!", err });
  }
});

// ++ 사용자가 작성한 주류 레시피 목록 - get

module.exports = router;
