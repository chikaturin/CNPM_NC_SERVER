const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileUpdate = require("../cloudinary.config");

const {
  register,
  signIn,
  DetailAccount,
  GetAccountByAdmin,
  UpdateAccount,
  GetAccountByCus,
  registerAdmin,
} = require("../Controller/AccountController");

const { checktoken } = require("../Middleware/check");

router.post("/register", fileUpdate.single("file"), register);
router.post("/signin", signIn);
router.get("/getaccountbycus", checktoken, GetAccountByCus);
router.get("/DetailAccount/:_id", DetailAccount);
router.get("/getaccount", GetAccountByAdmin);
router.post("/registeradmin", registerAdmin);
router.put("/updateaccount/:_id", UpdateAccount);
router.get("/user", checktoken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
