const DriverDB = require("../Schema/schema").Driver;
const counterDriver = require("../Schema/schema").CounterDriver;

const CreateDriver = async (req, res) => {
  try {
    const { NameDriver, NumberPhone, Driving_License, Image, Price } = req.body;
    const counterdriver = await counterDriver.findOneAndUpdate(
      { _id: "Driver" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const imageUrl = req.file.path;
    const _id = `DR${counterdriver.seq}`;
    const StateDriver = "Available";
    const driver = new DriverDB({
      _id,
      NameDriver,
      NumberPhone,
      Driving_License,
      Image: imageUrl,
      StateDriver,
      Price,
    });
    await driver.save();
    res.status(200).json({
      message: "Driver created successfully",
      driver: driver,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const salary = async (req, res) => {
  try {
    const { _id } = req.params; //id driver
    const { TotalDate } = req.body; // số ngày làm việc của 1 tháng
    const findDriver = await DriverDB.findOne({ _id });
    if (!findDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    const salary = findDriver.Price * TotalDate * 0.9;
    res.status(200).json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetDriverByAdmin = async (req, res) => {
  try {
    const driver = await DriverDB.find();
    res.status(200).json(driver);
  } catch (e) {
    res.status(400).json({ message: error.message });
  }
};

const GetDriverById = async (req, res) => {
  try {
    const { _id } = req.params;
    const driver = await DriverDB.findOne({ _id });
    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const UpdateDriver = async (req, res) => {
  try {
    const { _id } = req.params;
    const { Price, NumberPhone, Image, StateDriver } = req.body;
    const driver = await DriverDB.findOneAndUpdate(
      { _id },
      { Price, NumberPhone, Image, StateDriver },
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ message: "Driver not found to update" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetDriverByCustomer = async (req, res) => {
  try {
    const driver = await DriverDB.find({ StateDriver: "Available" });
    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const DeleteDriver = async (req, res) => {
  try {
    const { _id } = req.params;
    const driver = await DriverDB.findOne({ _id });
    if (
      driver.StateDriver == "Unavailable" ||
      driver.StateDriver == "Deleted"
    ) {
      return res
        .status(400)
        .json({ message: "Driver is not available, so you can not delete" });
    }
    if (!driver) {
      return res
        .status(404)
        .json({ message: "Driver not found to update state" });
    }
    driver.StateDriver = "Deleted";
    await driver.save();

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  CreateDriver,
  GetDriverByAdmin,
  GetDriverByCustomer,
  GetDriverById,
  UpdateDriver,
  DeleteDriver,
  salary,
};
