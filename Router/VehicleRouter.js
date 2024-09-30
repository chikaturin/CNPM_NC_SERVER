const express = require("express");
const router = express.Router();

const {
  createVehicle,
  getVehicleByAdmin,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  Sort_Vehicle,
  updateState,
} = require("../Controller/VehicleController");

router.post("/createVehicle", createVehicle);
router.get("/getVehicleByAdmin", getVehicleByAdmin);
router.get("/getVehicleById/:_id", getVehicleById);
router.put("/updateVehicle/:_id", updateVehicle);
router.get("/deleteVehicle/:_id", deleteVehicle);
router.post("/Sort_Vehicle", Sort_Vehicle);
router.post("/updateState/:_id", updateState);

module.exports = router;
