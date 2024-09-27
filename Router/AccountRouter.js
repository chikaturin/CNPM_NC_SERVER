const express = require("express");
const router = express.Router();

const {
  register,
  signIn,
  DetailAccount,
  GetAccountByAdmin,
  UpdateAccount,
  GetAccountByCus,
} = require("../Controller/AccountController");

const { checktokken } = require("../Middleware/check");

router.post("/register", register);
router.post("/signin", signIn);
router.get("/getaccountbycus", checktokken, GetAccountByCus);
router.get("/DetailAccount/:_id", DetailAccount);
router.get("/getaccount", GetAccountByAdmin);
router.put("/updateaccount/:_id", UpdateAccount);

module.exports = router;
