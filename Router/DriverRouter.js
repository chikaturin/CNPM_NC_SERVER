const express = require("express");
const router = express.Router();

const {
  CreateDriver,
  GetDriverByAdmin,
  GetDriverByCustomer,
  GetDriverById,
  UpdateDriver,
  DeleteDriver,
} = require("../Controller/DriverController");

router.post("/CreateDriver", CreateDriver);
router.get("/GetDriverByAdmin", GetDriverByAdmin);
router.get("/GetDriverByCustomer", GetDriverByCustomer);
router.get("/GetDriverById/:_id", GetDriverById);
router.put("/UpdateDriver/:_id", UpdateDriver);
router.get("/DeleteDriver/:_id", DeleteDriver);

module.exports = router;
