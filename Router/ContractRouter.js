const express = require("express");
const router = express.Router();

const {
  CalculateContractPrice,
  PaymentContract,
  HistoryContractByAdmin,
  HistoryContractByCustomer,
  GetContractById,
  CompletedContract,
  ContractByAdmin,
} = require("../Controller/ContractController");

const { checktoken } = require("../Middleware/check");

router.get("/ContractByAdmin", ContractByAdmin);

router.post("/CalculateContractPrice", CalculateContractPrice);
router.post("/PaymentContract", checktoken, PaymentContract);
router.get("/HistoryContractByAdmin", checktoken, HistoryContractByAdmin);
router.get("/HistoryContractByCustomer", checktoken, HistoryContractByCustomer);
router.get("/GetContractById/:_id", GetContractById);
router.post("/CompletedContract/:_id", CompletedContract);

module.exports = router;
