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
    const _id = `DR${counterdriver.seq}`;
    const StateDriver = "Available";
    const driver = new DriverDB({
      _id,
      NameDriver,
      NumberPhone,
      Driving_License,
      Image,
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
    res.status(200).json({ driver });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const UpdateDriver = async (req, res) => {
  try {
    const { _id } = req.params;
    const driver = await DriverDB.findOneAndUpdate({ _id });
    const { NameDriver, NumberPhone, IDCard, Image } = req.body;
    driver.NameDriver = NameDriver;
    driver.NumberPhone = NumberPhone;
    driver.IDCard = IDCard;
    driver.Image = Image;
    await driver.save();
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
    await DriverDB.findOneAndDelete({ _id });
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
};
