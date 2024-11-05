const CounterReservation = require("../Schema/schema").CounterReservation;
const ReservationDB = require("../Schema/schema").Reservation;
const ContractDB = require("../Schema/schema").Contract;
const VehicleDB = require("../Schema/schema").Vehicle;

const date = (a) => {
  return new Date(a).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const createVehicle_Reservation_Book = async (req, res) => {
  try {
    const { Desired_Date, MaVehicle, Return_Date } = req.body;
    const counter = await CounterReservation.findOneAndUpdate(
      { _id: "Reservation" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      return res.status(500).json({ message: "Unable to update counter" });
    }

    const _id = `RV${counter.seq}`;
    const MaKH = req.decoded._id;

    const vehicle = await VehicleDB.findById(MaVehicle);
    if (!vehicle) {
      return res.status(400).json({ message: "Vehicle does not exist" });
    }

    const desiredDate = new Date(Desired_Date);

    if (desiredDate < new Date()) {
      return res.status(400).json({ message: "Invalid Date" });
    }

    const contract = await ContractDB.findOne({ MaVehicle: _id });
    if (contract) {
      const returnDate = new Date(contract.Return_Date);
      if (desiredDate <= returnDate) {
        return res
          .status(201)
          .json({ message: "Vehicle is Unavailable Contract" });
      }
    }

    const ReturnDateCheck = new Date(Return_Date);

    if (ReturnDateCheck <= desiredDate) {
      return res
        .status(201)
        .json({ message: "Return Date must be after Desired Date" });
    }

    const reservationCheck = await ReservationDB.findOne({ MaVehicle });
    if (reservationCheck) {
      const reservationDate = new Date(reservationCheck.Desired_Date);
      if (ReturnDateCheck >= reservationDate) {
        return res.status(201).json({
          message:
            "You can not book this vehicle because it is reserved, Please choose a return date before " +
            date(reservationDate),
        });
      }
    }

    const Book_date = new Date();
    const reservation = await ReservationDB.create({
      _id,
      MaKH,
      Desired_Date,
      Book_date,
      MaVehicle,
      Return_Date,
    });

    res.status(200).json({
      message: "Vehicle_Reservation_Book created successfully",
      reservation,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVehicle_Reservation = async (req, res) => {
  try {
    const { _id } = req.params;
    const reservation = await ReservationDB.findOne({ _id });
    if (reservation.Desired_Date < new Date()) {
      return res.status(400).json({ message: "Reservation has passed" });
    }

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await ReservationDB.findOneAndDelete({ _id });
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
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createVehicle_Reservation_Book,
  deleteVehicle_Reservation,
  getVehicle_Reservation_ID,
  getVehicle_ReservationByCus,
  getVehicle_ReservationByAdmin,
};
