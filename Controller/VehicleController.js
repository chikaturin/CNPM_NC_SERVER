const VehicleDB = require("../Schema/schema").Vehicle;

const createVehicle = async (req, res) => {
  try {
    const { _id, Number_Seats, Image, Branch, Price } = req.body;
    const State = "Available";
    const vehicle = await VehicleDB.create({
      _id,
      Number_Seats,
      Image,
      Branch,
      Price,
      State,
    });
    await vehicle.save();
    res.status(201).json({ message: "VehicleDB created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVehicleByAdmin = async (req, res) => {
  try {
    const vehicle = await VehicleDB.find();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { _id } = req.params;
    const vehicle = await VehicleDB.findOne({ _id });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { _id } = req.params;
    const { Number_Seats, Image, Branch, Price } = req.body;
    const vehicle = await VehicleDB.findOneAndUpdate(
      { _id },
      { Number_Seats, Image, Branch, Price },
      { new: true }
    );
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { _id } = req.params;
    const vehicle = await VehicleDB.findById({ _id });
    if (vehicle.State == "Unavailable") {
      return res
        .status(400)
        .json({ message: "Vehicle is not available, so you can not delete" });
    }
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found to update state" });
    }
    await vehicle.findOneAndUpdate(
      {
        _id,
      },
      {
        State: "Unavailable",
      },
      { new: true }
    );
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
};

const Sort_Vehicle = async (req, res) => {
  try {
    const { Number_Seats } = req.body;
    const vehicle = await VehicleDB.findOne({ Number_Seats });
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found to update state" });
    }
    res.status(200).json(vehicle);
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
};

const updateState = async (req, res) => {
  try {
    const { _id } = req.params;

    const vehicle = await VehicleDB.findById(_id);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found to update state" });
    }
    if (vehicle.RemainQuantity == 0) {
      vehicle.State = "Unavaiable";
    } else {
      vehicle.State = vehicle.State === "Avaiable" ? "Unavaiable" : "Avaiable";
    }

    await vehicle.save();

    res.status(200).json({ message: "State updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehicleByAdmin,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  Sort_Vehicle,
  updateState,
};
