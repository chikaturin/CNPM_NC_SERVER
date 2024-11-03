const express = require("express");
const router = express.Router();

const {
  getVehicleByCus,
  createVehicle_Reservation_Book,
  deleteVehicle_Reservation,
  getVehicle_Reservation_ID,
  getVehicle_ReservationByCus,
  getVehicle_ReservationByAdmin,
} = require("../Controller/ReservationController");

const { checktoken } = require("../Middleware/check");

router.post("/getvehiclebycus/:_id", getVehicleByCus);
router.post(
  "/createvehicle_reservation_book",
  checktoken,
  createVehicle_Reservation_Book
);
router.get("/deletevehicle_reservation/:_id", deleteVehicle_Reservation);
router.get(
  "/getvehicle_reservation_id/:_id",
  checktoken,
  getVehicle_Reservation_ID
);
router.get(
  "/getvehicle_reservationbycus",
  checktoken,
  getVehicle_ReservationByCus
);
router.get("/getvehicle_reservationbyadmin", getVehicle_ReservationByAdmin);

module.exports = router;
