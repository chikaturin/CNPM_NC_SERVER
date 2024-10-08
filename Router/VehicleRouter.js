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
  getSort_Vehicle,
} = require("../Controller/VehicleController");

router.post("/createVehicle", createVehicle);
router.get("/getVehicleByAdmin", getVehicleByAdmin);
router.get("/DetailVehicle/:_id", getVehicleById);
router.put("/updateVehicle/:_id", updateVehicle);
router.get("/DeleteVehicle/:_id", deleteVehicle);
router.get("/Sort_Vehicle/:Number_Seats", Sort_Vehicle);
router.post("/updateState/:_id", updateState);
router.get("/getSort_Vehicle", getSort_Vehicle);

module.exports = router;
