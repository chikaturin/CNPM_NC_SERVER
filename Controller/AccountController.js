const CustomerDB = require("../Schema/schema.js").Customer;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs"); // Thêm thư viện bcryptjs để mã hóa mật khẩu
dotenv.config();

const register = async (req, res) => {
  try {
    const { NameCus, NumberPhone, IDCard, TypeCard, Image } = req.body;
    const _id = IDCard;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(IDCard, 10);

    const account = await CustomerDB.create({
      _id,
      NameCus,
      NumberPhone,
      IDCard: hashedPassword,
      TypeCard,
      Image,
    });

    await account.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { NameCus, IDCard } = req.body;

    const account = await CustomerDB.findOne({ NameCus });

    if (!account) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password with bcrypt
    const isMatch = await bcrypt.compare(IDCard, account.IDCard);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure account._id is defined before creating token
    if (!account._id) {
      return res.status(500).json({ message: "Account ID is missing" });
    }
    const accesstokken = jwt.sign(
      {
        _id: account._id,
        NameCus: account.NameCus,
        IDCard: account.IDCard,
        TypeCard: account.TypeCard,
        Image: account.Image,
        NumberPhone: account.NumberPhone,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json(accesstokken);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
};
