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

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.random().toString(36).substring(2, 15);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const { checktokken } = require("../Middleware/check");

router.post("/register", upload.single("Image"), register);
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
