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
  salary,
} = require("../Controller/DriverController");

router.post("/CreateDriver", fileUpdate.single("Image"), CreateDriver);
router.get("/GetDriverByAdmin", GetDriverByAdmin);
router.get("/GetDriverByCustomer", GetDriverByCustomer);
router.get("/GetDriverById/:_id", GetDriverById);
router.put("/UpdateDriver/:_id", UpdateDriver);
router.get("/DeleteDriver/:_id", DeleteDriver);
router.get("/salary/:_id", salary);

module.exports = router;
