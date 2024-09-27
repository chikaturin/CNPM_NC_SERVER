const express = require("express");
const router = express.Router();

const {
  CalculateContractPrice,
  PaymentContract,
  HistoryContractByAdmin,
  HistoryContractByCustomer,
  GetContractById,
  CompletedContract,
} = require("../Controller/ContractController");

const { checktokken } = require("../Middleware/check");

router.post("/CalculateContractPrice", CalculateContractPrice);
router.post("/PaymentContract", checktokken, PaymentContract);
router.get("/HistoryContractByAdmin", HistoryContractByAdmin);
router.get(
  "/HistoryContractByCustomer",
  checktokken,
  HistoryContractByCustomer
);
router.get("/GetContractById/:_id", GetContractById);
router.post("/CompletedContract/:_id", CompletedContract);

module.exports = router;
