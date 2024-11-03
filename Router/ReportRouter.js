const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileUpdate = require("../cloudinary.config");

const {
  CreateReport,
  GetReport,
  GetReportById,
  DeleteReport,
} = require("../Controller/ReportController");

const CheckToken = require("../Middleware/check").checktoken;

router.post("/CreateReport", fileUpdate.single("file"), CreateReport);
router.get("/GetReport", GetReport);
router.get("/GetReportById/:_id", GetReportById);
router.delete("/DeleteReport/:_id", DeleteReport);
module.exports = router;
