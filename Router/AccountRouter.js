const express = require("express");
const router = express.Router();

const {
  register,
  signIn,
  DetailAccount,
  GetAccountByAdmin,
  UpdateAccount,
  GetAccountByCus,
  registerAdmin,
} = require("../Controller/AccountController");

const { checktokken } = require("../Middleware/check");

router.post("/register", register);
router.post("/signin", signIn);
router.get("/getaccountbycus", checktokken, GetAccountByCus);
router.get("/DetailAccount/:_id", DetailAccount);
router.get("/getaccount", GetAccountByAdmin);
router.post("/registeradmin", registerAdmin);
router.put("/updateaccount/:_id", UpdateAccount);
router.get("/user", checktokken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
