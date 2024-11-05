const express = require("express");
const router = express.Router();

const {
  createVehicle_Reservation_Book,
  deleteVehicle_Reservation,
  getVehicle_Reservation_ID,
  getVehicle_ReservationByCus,
  getVehicle_ReservationByAdmin,
  dateContract,
  dateReservation,
} = require("../Controller/ReservationController");

const { checktoken } = require("../Middleware/check");

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

router.get("/datecontract", dateContract);
router.get("/datereservation", dateReservation);

module.exports = router;
