const express = require("express");
const router = express.Router();

const {
  CreateReport,
  GetReport,
  GetReportById,
  DeleteReport,
} = require("../Controller/ReportController");

router.post("/CreateReport", CreateReport);
router.get("/GetReport", GetReport);
router.get("/GetReportById/:_id", GetReportById);
router.delete("/DeleteReport/:_id", DeleteReport);
module.exports = router;
