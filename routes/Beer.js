const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { Beer } = require("../models/Beer");
const { User } = require("../models/User");
const { Recipe } = require("../models/Recipe");

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
    console.log(recommendList);
    console.log(random);
    const result = recommendList[random];
    console.log(result);

    res
      .status(200)
      .json({ success: true, message: "Recommend Finish!", result });
  } catch (err) {
    return res.status(400).json({
      sccess: false,
      message: "Recommend false!",
      err,
    });
  }
});

// 주류, 주류 레시피 검색 기능 - get

module.exports = router;
