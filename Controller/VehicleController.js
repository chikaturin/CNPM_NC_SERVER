const VehicleDB = require("../Schema/schema").Vehicle;
const ImageDB = require("../Schema/schema").ImageVehicle;
const { z } = require("zod");

const createVehicle = async (req, res) => {
  const vehicleSchema = z.object({
    _id: z.string().min(1, "Vehicle ID is required"),
    Number_Seats: z.number().min(1, "Number_Seats must be greater than 0"),
    Branch: z.string(),
    Price: z.number().min(1, "Price must be greater than 0"),
    Description: z.string(),
    ImageVehicles: z.array(z.string()).optional(),
    VehicleName: z.string(),
  });

  try {
    const validateData = vehicleSchema.parse(req.body);
    const {
      _id,
      Number_Seats,
      Branch,
      Price,
      Description,
      VehicleName,
      ImageVehicles,
    } = validateData;
    const State = "Available";
    const CreateDate = new Date();
    const CreateBy = req.decoded._id;

    for (const imgVehicle of ImageVehicles) {
      const newImage = await ImageDB.create({
        Vehicle_ID: _id,
        ImageVehicle: imgVehicle,
      });
      await newImage.save();
    }

    const vehicle = await VehicleDB.create({
      _id,
      Number_Seats,
      Branch,
      Price,
      Description,
      State,
      CreateBy,
      VehicleName,
      CreateDate,
    });
    await vehicle.save();

    res.status(201).json({ message: "VehicleDB created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVehicleByAdmin = async (req, res) => {
  try {
    const vehicle = await VehicleDB.aggregate([
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "Vehicle_ID",
          as: "images",
        },
      },
    ]);
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleByCus = async (req, res) => {
  try {
    const vehicles = await VehicleDB.find({ State: "Available" });

    const response = await Promise.all(
      vehicles.map(async (vehicle) => {
        const images = await ImageDB.find({ Vehicle_ID: vehicle._id });
        return {
          ...vehicle.toObject(),
          imageVehicle: images.map((image) => image.ImageVehicle),
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { _id } = req.params;

    const vehicleDetail = await VehicleDB.findById(_id);

    if (!vehicleDetail) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const imageVehicle = await ImageDB.find({ Vehicle_ID: _id });

    const response = {
      ...vehicleDetail.toObject(),
      imageVehicle: imageVehicle.map((image) => image.ImageVehicle),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  const vehicleSchema = z.object({
    Price: z.min(0, "Price must be greater than 0"),
    Description: z.string(),
  });
  try {
    const { _id } = req.params;
    const validateData = vehicleSchema.parse(req.body);
    const { Price, State, Description } = validateData;
    const vehicle = await VehicleDB.findOneAndUpdate(
      { _id },
      { State, Description, Price },
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
    const vehicle = await VehicleDB.findOne({ _id });
    if (vehicle.State == "Unavailable" || vehicle.State == "Deleted") {
      return res
        .status(400)
        .json({ message: "Vehicle is not available, so you can not delete" });
    }
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found to update state" });
    }
    vehicle.State = "Deleted";
    await vehicle.save();
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const Sort_Vehicle = async (req, res) => {
  try {
    const { Number_Seats } = req.params;
    const vehicle = await VehicleDB.find({ Number_Seats });
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

const getSort_Vehicle = async (req, res) => {
  try {
    const vehicle = await VehicleDB.find()
      .select("Number_Seats")
      .distinct("Number_Seats");
    res.status(200).json(vehicle);
  } catch (e) {
    res.status(500).json({ message: e.message });
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
  getVehicleByCus,
  getSort_Vehicle,
};
