const ReservationDB = require("../Schema/schema").Reservation;

const CounterReservation = require("../Schema/schema").CounterReservation;
const ReservationDB = require("../Schema/schema").Reservation;
const VehicleDB = require("../Schema/schema").Vehicle;
const ContractDB = require("../Schema/schema").Contract;
const DriverDB = require("../Schema/schema").Driver;

const getVehicleByCus = async (req, res) => {
  try {
    const { Desired_Date } = req.body;
    const desiredDate = new Date(Desired_Date);

    const contracts = await ContractDB.find({
      Return_Date: { $gte: desiredDate },
    });

    const reservations = await ReservationDB.find({
      Desired_Date: { $gte: desiredDate },
    });

    const reservedVehicleIds = [
      ...contracts.map((contract) => contract.MaVehicle),
      ...reservations.map((reservation) => reservation.MaVehicle),
    ];

    const availableVehicles = await VehicleDB.find({
      _id: { $nin: reservedVehicleIds },
      State: "Available",
    });

    res.status(200).json({ availableVehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVehicle_Reservation_Book = async (req, res) => {
  try {
    const { Desired_Date, MaVehicle } = req.body;
    const _id = `RV${await CounterReservation.findOneAndUpdate(
      { _id: "Reservation" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).seq}`;
    const MaKH = req.decoded._id;

    const Book_date = new Date();
    const reservation = await ReservationDB.create({
      _id,
      MaKH,
      Desired_Date,
      Book_date,
      MaVehicle,
    });
    await reservation.save();
    res
      .status(201)
      .json({ message: "Vehicle_Reservation_Book created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVehicle_Reservation = async (req, res) => {
  try {
    const { _id } = req.params;
    const reservation = await ReservationDB.findOneAndDelete({ _id });
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVehicle_Reservation_ID = async (req, res) => {
  try {
    const { _id } = req.params;
    const reservation = await ReservationDB.findById(_id);
    res.status(200).json({ reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVehicle_ReservationByCus = async (req, res) => {
  try {
    const MaKH = req.decoded._id;
    const reservations = await ReservationDB.find({ MaKH });
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVehicle_ReservationByAdmin = async (req, res) => {
  try {
    const reservations = await ReservationDB.find();
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getVehicleByCus,
  createVehicle_Reservation_Book,
  deleteVehicle_Reservation,
  getVehicle_Reservation_ID,
  getVehicle_ReservationByCus,
  getVehicle_ReservationByAdmin,
};
