const express = require("express");
const router = express.Router();
const { Beer } = require("../models/Beer");

// (admin) 주류 추가 - post
router.post("/postBeer", (req, res) => {
  Beer.insertMany(req.body);
  res.status(200).json({ success: true, message: "Finish to insert data!" });
});

// 주류 목록 페이지네이션 6 or 9 - get

// 주류 상세 - get

// 주류 추천 기능 - get

// 주류, 주류 레시피 검색 기능 - get

module.exports = router;
