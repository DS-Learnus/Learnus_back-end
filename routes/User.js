const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

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

// 주류 좋아요 기능 - post

// 주류 레시피 좋아요 기능 - post

// 사용자가 선호하는 주류 목록 - get

// 사용자가 선호하는 주류 레시피 목록 - get

// 사용자가 작성한 주류 레시피 목록 - get

module.exports = router;
