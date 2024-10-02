const CustomerDB = require("../Schema/schema.js").Customer;
const AdminDB = require("../Schema/schema.js").Admin;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const register = async (req, res) => {
  try {
    const { NameCus, NumberPhone, IDCard, TypeCard } = req.body;
    const _id = IDCard;

    const imagePath = req.file ? req.file.path : null;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng tải lên hình ảnh." });
    }

    const hashedPassword = await bcrypt.hash(IDCard, 10);

    const account = await CustomerDB.create({
      _id,
      NameCus,
      NumberPhone,
      IDCard: hashedPassword,
      TypeCard,
      Image: imagePath,
    });

    await account.save();

    res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { _id, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const account = await AdminDB.create({ _id, Password: hashedPassword });
    res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
    await account.save();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { Name, Password } = req.body;

    const admin = await AdminDB.findOne({ _id: Name });
    const account = await CustomerDB.findOne({ NameCus: Name });

    let isMatch, accesstoken;

    if (admin) {
      isMatch = await bcrypt.compare(Password, admin.Password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Tài khoản hoặc mật khẩu không hợp lệ" });
      }

      accesstoken = jwt.sign(
        { _id: admin._id, role: "Admin" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
      );
    } else {
      if (!account) {
        return res.status(400).json({ message: "Tài khoản không hợp lệ" });
      }

      isMatch = await bcrypt.compare(Password, account.IDCard);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không hợp lệ" });
      }

      accesstoken = jwt.sign(
        {
          _id: account._id,
          NameCus: account.NameCus,
          IDCard: account.IDCard,
          TypeCard: account.TypeCard,
          Image: account.Image,
          NumberPhone: account.NumberPhone,
          role: "Customer",
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
      );
    }
    res.status(200).json({ token: accesstoken });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại" });
  }
};

const GetAccountByCus = async (req, res) => {
  try {
    const account = req.decoded;
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAccountByAdmin = async (req, res) => {
  try {
    const account = await CustomerDB.find();
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DetailAccount = async (req, res) => {
  try {
    const { _id } = req.params;
    const account = await CustomerDB.findOne({ _id });
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateAccount = async (req, res) => {
  try {
    const { _id } = req.params;
    const account = await CustomerDB.findOneAndUpdate({ _id });
    const { NameCus, NumberPhone, IDCard, TypeCard, Image } = req.body;
    account.NameCus = NameCus;
    account.NumberPhone = NumberPhone;
    account.IDCard = IDCard;
    account.TypeCard = TypeCard;
    account.Image = Image;
    await account.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  signIn,
  DetailAccount,
  GetAccountByAdmin,
  GetAccountByCus,
  UpdateAccount,
  registerAdmin,
};
