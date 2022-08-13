const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    resultTime: Date,
    enodebId: String,
    cellId: String,
    availDur: Number,
  },
  { collection: "raw_data" }
);

module.exports = mongoose.model("Data", dataSchema);
