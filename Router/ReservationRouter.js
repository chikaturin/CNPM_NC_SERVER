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

const { checktokken } = require("../Middleware/check");

router.get("/getvehiclebycus", getVehicleByCus);
router.post(
  "/createvehicle_reservation_book",
  checktokken,
  createVehicle_Reservation_Book
);
router.delete(
  "/deletevehicle_reservation/:_id",
  checktokken,
  deleteVehicle_Reservation
);
router.get(
  "/getvehicle_reservation_id/:_id",
  checktokken,
  getVehicle_Reservation_ID
);
router.get(
  "/getvehicle_reservationbycus",
  checktokken,
  getVehicle_ReservationByCus
);
router.get(
  "/getvehicle_reservationbyadmin",
  checktokken,
  getVehicle_ReservationByAdmin
); //export the router
