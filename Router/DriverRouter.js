const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileUpdate = require("../cloudinary.config");

const {
  CreateDriver,
  GetDriverByAdmin,
  GetDriverByCustomer,
  GetDriverById,
  UpdateDriver,
  DeleteDriver,
} = require("../Controller/DriverController");

router.post("/CreateDriver", fileUpdate.single("file"), CreateDriver);
router.get("/GetDriverByAdmin", GetDriverByAdmin);
router.get("/GetDriverByCustomer", GetDriverByCustomer);
router.get("/GetDriverById/:_id", GetDriverById);
router.put("/UpdateDriver/:_id", UpdateDriver);
router.get("/DeleteDriver/:_id", DeleteDriver);

module.exports = router;
