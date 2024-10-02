const express = require("express");
const app = express();
const data = require("./Data/data.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());
const PORT = 8000;

const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Thư mục uploads đã được tạo.");
}

data;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.json({ status: "Welcome to Rental4U" });
});

app.use("/api", require("./Router/AccountRouter.js"));
app.use("/api", require("./Router/VehicleRouter.js"));
app.use("/api", require("./Router/ContractRouter.js"));
app.use("/api", require("./Router/DriverRouter.js"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
