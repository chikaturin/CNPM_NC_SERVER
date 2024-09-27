const Report = require("../Schema/schema").Report;
const couterRerport = require("../Schema/schema").CounterReport;

const CreateReport = async (res, req) => {
  try {
    const { Content, image, ID_Contract } = req.body;
    const counterReport = await couterRerport.findOneAndUpdate(
      { _id: "Report" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const _id = `RP${counterReport.seq}`;
    const report = new Report({
      _id,
      Content,
      image,
      ID_Contract,
    });
    await report.save();
    res.status(200).json({
      message: " Report created successfully",
      voucher: voucher,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetReport = async (res, req) => {
  try {
    const report = await Report.find();
    res.status(200).json({ report });
  } catch (e) {
    res.status(400).json({ message: error.message });
  }
};

const GetReportById = async (res, req) => {
  try {
    const { _id } = req.params;
    const report = await Report.findOne({ _id });
    res.status(200).json({ report });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const DeleteReport = async (res, req) => {
  try {
    const { _id } = req.params;
    await Report.findOneAndDelete({ _id });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export { CreateReport, GetReport, GetReportById, DeleteReport };
