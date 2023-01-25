const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Recipe } = require("../models/Recipe");
const { Ingredient } = require("../models/Ingredient");
const { RecipeReview } = require("../models/RecipeReview");

// (admin) 레시피 추가 - post
router.post("/postRecipe", (req, res) => {
  Recipe.insertMany(req.body);
  res.status(200).json({ success: true, message: "Finish to insert data!" });
});

// (admin) 재료 추가 - post
router.post("/postIngredient", (req, res) => {
  Ingredient.insertMany(req.body);
  res.status(200).json({ success: true, message: "Finish to insert data!" });
});

// 레시피 목록 페이지네이션 6 or 9 - get
router.get("/recipeList", async (req, res) => {
  try {
    const page = Number(req.query.page || 1); // default page
    const perPage = 3;
    const sort = Number(req.query.sort || 1); // 1: 이름순, 2: 인기순
    const recipes = await Recipe.find({})
      .sort(sort == 1 ? { name: 1 } : { likes: -1 }) //-1: desc, 1: asc
      .skip(perPage * (page - 1)) // 검색 시 포함되지 않을 데이터 수
      .limit(perPage);

    let isLast = false;
    const totalCount = await Recipe.countDocuments({});
    if (totalCount % perPage == 0) {
      if (page == parseInt(totalCount / perPage)) {
        isLast = true;
      }
    } else if (page == parseInt(totalCount / perPage) + 1) {
      isLast = true;
    }
    res.status(200).json({ success: true, recipes, isLast: isLast });
  } catch (err) {
    return res.status(400).json({
      sccess: false,
      message: "Access false!",
      err,
    });
  }
});

// **레시피 상세 목록 - get
router.get("/:recipeId", async (req, res) => {
  const recipeId = mongoose.Types.ObjectId(req.params.recipeId);

  Recipe.findOne({ _id: recipeId })
    .populate({ path: "ingredient", model: "Ingredient" })
    .populate({ path: "review", model: "RecipeReview" })
    .populate({ path: "userId", model: "User", select: { nikname: 1 } })
    .then(async (recipeDetail) => {
      return res
        .status(200)
        .json({ success: true, message: "Access success!", recipeDetail });
    }) // 레시피 재료 populate 해서 보여줘야함.
    .catch((err) => {
      return res.status(400).json({
        success: false,
        message: "Access false!",
        err,
      });
    });
});

// **레시피 등록 - post
// 프론트에서 재료(이름, 양, 단위) 개당 배열에 넣어서 보내달라고 하기
router.post("/addRecipe", async (req, res) => {
  try {
    const beerId = req.body.beerId;
    const userId = req.body.userId;
    const content = req.body.content;
    const name = req.body.name;
    const ingredient = req.body.ingredient; // array
    console.log(ingredient.length);
    console.log("실행0");

    // 1. 레시피 등록
    let recipeId;
    const newRecipe = new Recipe({
      name: name,
      beerId: beerId,
      userId: userId,
      content: content,
    });
    console.log("실행1");
    await newRecipe.save(async (err, recipeInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      console.log("실행2");
      recipeId = recipeInfo._id; // recipe id 얻기

      // 2. Ingredient 등록
      for (i = 0; i < ingredient.length; i++) {
        // 2-1 객체 생성
        console.log("실행3");
        const newIngredient = new Ingredient({
          recipeId: recipeId,
          name: ingredient[i][0],
          amount: ingredient[i][1],
          unit: ingredient[i][2],
        });
        console.log("실행4");

        // 2-2 save
        await newIngredient
          .save
          //(err, ingreInfo) => {
          // if (err)
          //   return res
          //     .status(400)
          //     .json({ success: false, message: "ingredient save error!", err });
          // return res.status(200).json({ success: true, ingreInfo });
          //}
          ();
      }

      // 3. 등록했던 Ingredient 찾고 각각의 _id 얻기
      console.log("실행5");
      const findIngre = await Ingredient.find({ recipeId: recipeId });
      let arrayIngreId = new Array(0);

      for (i = 0; i < findIngre.length; i++) {
        arrayIngreId.push(findIngre[i]._id);
      }
      // 4. Recipe의 Ingredient 배열에 ingredient _id 등록하기
      console.log(arrayIngreId);
      Recipe.updateOne(
        { _id: recipeId },
        {
          $push: { ingredient: { $each: arrayIngreId } },
        },
        (err, recipeInfo) => {
          if (err)
            return res
              .status(400)
              .json({ success: true, message: "recipe update error!", err });
          return res.status(200).json({ success: true, recipeInfo });
        }
      );

      // return res
      //   .status(200)
      //   .json({ success: true, message: "레시피를 등록했어요", recipeInfo });
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "code error!",
    });
  }
});

// 레시피에 평점과 후기 달기 - post
router.post("/addReview", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    const newRecipeReview = new RecipeReview(req.body);
    // 리뷰 저장하기
    newRecipeReview.save(async (err, review) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "False to add review." });
      console.log("실행0");
      // Beer에 review 추가하기
      await Recipe.updateOne(
        { _id: recipeId },
        { $push: { review: review._id } }
      );
    });
    return res.status(200).json({
      success: true,
      message: "Success to add a review in Recipe array.",
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Error code." });
  }
});

module.exports = router;
