const ContractDB = require("../Schema/schema").Contract;
const DriverDB = require("../Schema/schema").Driver;
const VehicleDB = require("../Schema/schema").Vehicle;
const CounterContractDB = require("../Schema/schema").CounterContract;
const ReservationDB = require("../Schema/schema").Reservation;

const CalculateContractPrice = async (req, res) => {
  try {
    const { Pickup_Date, Return_Date, MaVehicle, MaDriver, Insurance } =
      req.body;

    const pickupDateObj = new Date(Pickup_Date);
    const returnDateObj = new Date(Return_Date);

    const timeDiff = Math.abs(returnDateObj - pickupDateObj);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const Vehicle = await VehicleDB.findOne({ _id: MaVehicle });
    if (!Vehicle) {
      return res.status(400).json({ message: "Vehicle not found" });
    }

    let totalPay;

    if (!MaDriver) {
      totalPay = Vehicle.Price * daysDiff + Insurance;
    } else {
      const Driver = await DriverDB.findOne({ _id: MaDriver });
      if (!Driver) {
        return res.status(400).json({ message: "Driver not found" });
      }
      totalPay = (Vehicle.Price + Driver.Price) * daysDiff + Insurance;
    }

    res.status(200).json(totalPay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const date = (a) => {
  return new Date(a).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const PaymentContract = async (req, res) => {
  try {
    const { Pickup_Date, Return_Date, MaVehicle, MaDriver, Total_Pay } =
      req.body;

    const StatePay = "Staked";
    const MaKH = req.decoded._id;
    const ContractDate = new Date();
    const return_Date = new Date(Return_Date);
    const pickup_Date = new Date(Pickup_Date);

    const checkCus = await ContractDB.findOne({ MaKH, StatePay: "Staked" });
    if (checkCus) {
      return res.status(400).json({ message: "Customer has a contract" });
    }

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

    const checkcontract = await ContractDB.findOne({ _id });
    if (!checkcontract) {
      console.log("Contract not found");
      return res.status(403).json({ message: "Contract not found" });
    }

    if (checkcontract.StatePay === "Paid") {
      console.log("Contract has already been completed");
      return res
        .status(401)
        .json({ message: "Contract has already been completed" });
    }

    if (new Date(checkcontract.Return_Date) > new Date()) {
      console.log("Contract return date cannot be completed");
      return res
        .status(402)
        .json({ message: "Contract return date has passed" });
    }

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
      await DriverDB.findOneAndUpdate(
        { _id: contract.MaDriver },
        { StateDriver: "Available" },
        { new: true }
      );
    }

    res.status(200).json({ message: "Contract completed successfully" });
  } catch (error) {
    console.error("Error completing contract:", error);
    res.status(405).json({
      message: "An error occurred while completing the contract",
      error: error.message,
    });
  }
};

const findContractDriver = async (req, res) => {
  try {
    const { MaDriver } = req.params;
    const checkcontract = await ContractDB.find({
      MaDriver,
    });
    if (checkcontract.StatePay === "Staked") {
      return res
        .status(200)
        .json({ message: "Driver has not completed contract" });
    }

    if (!checkcontract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    let Working_Date = 0;

    for (const datecontract of checkcontract) {
      if (datecontract.Pickup_Date && datecontract.Return_Date) {
        const pickupDate = new Date(datecontract.Pickup_Date);
        const returnDate = new Date(datecontract.Return_Date);
        const days = (returnDate - pickupDate) / (1000 * 60 * 60 * 24);
        Working_Date += Math.max(0, days);
      }
    }

    const driver = await DriverDB.findOne(MaDriver);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    const salary = Working_Date * driver.Price;

    res.status(200).json({ salary });
  } catch (error) {
    console.error("Error finding contract driver:", error);
    res.status(405).json({
      message: "An error occurred while finding contract driver",
      error: error.message,
    });
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
  findContractDriver,
};
