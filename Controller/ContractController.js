const ContractDB = require("../Schema/schema").Contract;
const DriverDB = require("../Schema/schema").Driver;
const VehicleDB = require("../Schema/schema").Vehicle;
const CounterContractDB = require("../Schema/schema").CounterContract;

const CalculateContractPrice = async (req, res) => {
  try {
    const { Pickup_Date, Return_Date, MaVehicle, MaDriver } = req.body;

    const pickupDateObj = new Date(Pickup_Date);
    const returnDateObj = new Date(Return_Date);

    const timeDiff = Math.abs(returnDateObj - pickupDateObj);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const Vehicle = await VehicleDB.findOne({ _id: MaVehicle });
    let totalPay;

    if (!Vehicle) {
      res.status(400).json({ message: "Vehicle not found" });
    }

    if (!MaDriver) {
      totalPay = Vehicle.Price * daysDiff;
    } else {
      const Driver = await DriverDB.findOne({ _id: MaDriver });
      totalPay = (Vehicle.Price + Driver.Price) * daysDiff;
    }

    res.status(200).json(totalPay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const PaymentContract = async (req, res) => {
  try {
    const { Pickup_Date, Return_Date, MaVehicle, MaDriver, Total_Pay } =
      req.body;

    const StatePay = "Staked";
    const MaKH = req.decoded._id;
    const ContractDate = new Date();

    const counterContract = await CounterContractDB.findOneAndUpdate(
      { _id: "Contract" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const Vehicle = await VehicleDB.findOneAndUpdate(
      { _id: MaVehicle },
      { State: "Unavailable" },
      { new: true }
    );

    const _id = `CT${counterContract.seq}`;
    let contract;

    if (!MaDriver) {
      contract = new ContractDB({
        _id,
        StatePay,
        Total_Pay,
        ContractDate,
        Pickup_Date,
        Return_Date,
        MaKH,
        MaVehicle,
      });
    } else {
      const Driver = await DriverDB.findOneAndUpdate(
        { _id: MaDriver },
        { StateDriver: "Unavailable" },
        { new: true }
      );
      if (!Driver) {
        res.status(400).json({ message: "Driver not found" });
      }
      await Driver.save();
      contract = new ContractDB({
        _id,
        StatePay,
        Total_Pay,
        ContractDate,
        Pickup_Date,
        Return_Date,
        MaKH,
        MaVehicle,
        MaDriver,
      });
      await Driver.save();
    }
    await Vehicle.save();
    await contract.save();
    res.status(200).json({ message: "Thanh toán thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const HistoryContractByAdmin = async (req, res) => {
  const { StatePay } = req.params;
  try {
    const contract = await ContractDB.find({ StatePay: StatePay });
    res.status(200).json(contract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const ContractByAdmin = async (req, res) => {
  try {
    const contract = await ContractDB.find();
    res.status(200).json(contract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const HistoryContractByCustomer = async (req, res) => {
  const { StatePay } = req.params;
  const MaKH = req.decoded._id;
  try {
    const contract = await ContractDB.find({ StatePay: StatePay, MaKH });
    if (contract) {
      res.status(200).json(contract);
    } else {
      res.status(400).json({ message: "Contract not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetContractById = async (req, res) => {
  try {
    const { _id } = req.params;
    const contract = await ContractDB.findOne({ _id });
    res.status(200).json(contract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const CompletedContract = async (req, res) => {
  try {
    const { _id } = req.params;
    const contract = await ContractDB.findOneAndUpdate(
      { _id },
      { StatePay: "Paid" },
      { new: true }
    );
    const Vehicle = await VehicleDB.findOneAndUpdate(
      { _id: contract.MaVehicle },
      { State: "Available" },
      { new: true }
    );
    if (contract.MaDriver) {
      const Driver = await DriverDB.findOneAndUpdate(
        { _id: contract.MaDriver },
        { StateDriver: "Available" },
        { new: true }
      );
      await Driver.save();
    }
    await Vehicle.save();
    res.status(200).json({ message: "Contract completed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  CalculateContractPrice,
  PaymentContract,
  HistoryContractByAdmin,
  HistoryContractByCustomer,
  GetContractById,
  CompletedContract,
  ContractByAdmin,
};
