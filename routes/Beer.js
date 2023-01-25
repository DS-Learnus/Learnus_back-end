const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { Beer } = require("../models/Beer");
const { User } = require("../models/User");
const { Recipe } = require("../models/Recipe");
const { BeerReview } = require("../models/BeerReview");

// (admin) 주류 추가 - post
router.post("/postBeer", (req, res) => {
  Beer.insertMany(req.body);
  res.status(200).json({ success: true, message: "Finish to insert data!" });
});

// 주류 목록 페이지네이션 6 or 9 - get
router.get("/beerList", async (req, res) => {
  try {
    const page = Number(req.query.page || 1); // default page
    const perPage = 3;
    const sort = Number(req.query.sort || 1); // 1: 이름순, 2: 인기순
    const beers = await Beer.find({})
      .sort(sort == 1 ? { name: 1 } : { likes: -1 }) //-1: desc, 1: asc
      .skip(perPage * (page - 1)) // 검색 시 포함되지 않을 데이터 수
      .limit(perPage);

    let isLast = false;
    const totalCount = await Beer.countDocuments({});
    if (totalCount % perPage == 0) {
      if (page == parseInt(totalCount / perPage)) {
        isLast = true;
      }
    } else if (page == parseInt(totalCount / perPage) + 1) {
      isLast = true;
    }
    res.status(200).json({ success: true, beers, isLast: isLast });
  } catch (err) {
    return res.status(400).json({
      sccess: false,
      message: "Access false!",
      err,
    });
  }
});

// 주류 상세 - get
router.get("/:beerId", async (req, res) => {
  const beerId = mongoose.Types.ObjectId(req.params.beerId);

  Beer.findOne({ _id: beerId })
    .populate({ path: "review", model: "BeerReview" })
    .then(async (beerDetail) => {
      return res
        .status(200)
        .json({ success: true, message: "Access success!", beerDetail });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        message: "Access false!",
        err,
      });
    });
});

// 주류 추천 기능 - get
router.get("/recommend/:userId", async (req, res) => {
  try {
    // userId에 해당하는 user 찾기
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const user = await User.findOne({ _id: userId });

    //사용자에게 주량 얻기(단계)
    const level = user.userAbv; // 단계
    const abv = level * 5; // 도수는 단계*5배로 하는게 어떨까?
    console.log(abv);

    //도수가 abv보다 낮은 맥주 목록 불러오기
    const recommendList = await Beer.find({ abv: { $lte: abv } });
    // random
    const random = Math.floor(Math.random() * recommendList.length);
    //console.log(recommendList);
    //console.log(random);
    const result = recommendList[random];
    //console.log(result);

    let resultRecipe = null;
    const recommendRecipe = await Recipe.find({ beerId: result._id });
    console.log(recommendRecipe);
    if (recommendRecipe.length != 0) {
      const random = Math.floor(Math.random() * recommendRecipe.length);
      resultRecipe = recommendRecipe[random];

      return res.status(200).json({
        success: true,
        message: "Recommend Finish!, recommend recipe not null.",
        result,
        resultRecipe,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Recommend Finish!, recommend recipe null.",
      result,
      resultRecipe,
    });
  } catch (err) {
    return res.status(400).json({
      sccess: false,
      message: "Recommend false!",
      err,
    });
  }
});

// 주류에 평점과 후기 달기 - post
router.post("/addReview", async (req, res) => {
  const beerId = req.body.beerId;

  try {
    const newBeerReview = new BeerReview(req.body);
    // 리뷰 저장하기
    newBeerReview.save(async (err, review) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "False to add review." });
      console.log("실행0");
      // Beer에 review 추가하기
      await Beer.updateOne({ _id: beerId }, { $push: { review: review._id } });
    });
    return res.status(200).json({
      success: true,
      message: "Success to add a review in Beer array.",
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Error code." });
  }
});

// 주류, 주류 레시피 검색 기능 - get, params 사용 (빼면 안될까요?)

module.exports = router;
