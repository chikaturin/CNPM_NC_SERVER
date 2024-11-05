const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});

const AdminSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  Password: { type: String, required: true },
});

const customerSchema = new mongoose.Schema({
  _id: { type: String, required: true }, //Mã Khách hàng
  NameCus: { type: String, required: true },
  NumberPhone: { type: String, required: true },
  IDCard: { type: String, required: true },
  TypeCard: { type: String, required: true },
  Image: { type: String, required: true },
});

//Sổ đặt xe trước
const ReservationSchema = new mongoose.Schema({
  _id: { type: String, required: true }, //Mã đặt xe trước
  Book_date: { type: Date, required: true },
  Desired_Date: { type: Date, required: true },
  Return_Date: { type: Date, required: true },
  MaKH: { type: String, required: true },
  MaVehicle: { type: String, required: true },
});

const VehicleSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // biển số xe
  Number_Seats: { type: Number, required: true },
  Branch: { type: String, required: true },
  State: { type: String, required: true },
  Price: { type: Number, required: true },
  Description: { type: String, required: true },
  CreateBy: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  VehicleName: { type: String, required: true },
});

const ImageSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  Vehicle_ID: { type: String, required: true },
  ImageVehicle: { type: String, required: true },
});

const DriverSchema = new mongoose.Schema({
  _id: { type: String, required: true }, //Mã tài xế
  NameDriver: { type: String, required: true },
  NumberPhone: { type: String, required: true },
  Driving_License: { type: String, required: true }, //bằng lái
  Image: { type: String, required: true },
  StateDriver: { type: String, required: true },
  Price: { type: Number, required: true },
});

const ContractSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  StatePay: { type: String, required: true },
  Total_Pay: { type: Number, required: true },
  ContractDate: { type: Date, required: true },
  Pickup_Date: { type: Date, required: true },
  Return_Date: { type: Date, required: true },
  MaVehicle: { type: String, required: true },
  MaDriver: { type: String },
  MaKH: { type: String, required: true },
});

const ReportSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  Content: { type: String, required: true },
  Image: { type: String, required: true },
  IDContract: { type: String, required: true },
  ReportBy: { type: String, required: true },
});

const CounterReport = mongoose.model("CounterReport", counterSchema);
const CounterDriver = mongoose.model("CounterDriver", counterSchema);
const CounterContract = mongoose.model("CounterContract", counterSchema);
const CounterReservation = mongoose.model("CounterReservation", counterSchema);

const Customer = mongoose.model("Customer", customerSchema);
const Vehicle = mongoose.model("Vehicle", VehicleSchema);
const Driver = mongoose.model("Driver", DriverSchema);
const Contract = mongoose.model("Contract", ContractSchema);
const Report = mongoose.model("Report", ReportSchema);
const Reservation = mongoose.model("Reservation", ReservationSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const ImageVehicle = mongoose.model("Image", ImageSchema);

module.exports = {
  CounterReport,
  CounterDriver,
  CounterContract,
  CounterReservation,

  Customer,
  Vehicle,
  Driver,
  Contract,
  Report,
  Reservation,
  Admin,
  ImageVehicle,
};
