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
  findContractDriver,
} = require("../Controller/ContractController");

const { checktoken } = require("../Middleware/check");

router.get("/ContractByAdmin", ContractByAdmin);

router.post("/CalculateContractPrice", CalculateContractPrice);
router.post("/PaymentContract", checktoken, PaymentContract);
router.get("/HistoryContractByAdmin/:StatePay", HistoryContractByAdmin);
router.get(
  "/HistoryContractByCustomer/:StatePay",
  checktoken,
  HistoryContractByCustomer
);
router.get("/GetContractById/:_id", GetContractById);
router.post("/CompletedContract/:_id", CompletedContract);

router.get("/findContractDriver/:MaVehicle", findContractDriver);

module.exports = router;
