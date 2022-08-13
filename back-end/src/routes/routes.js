const Model = require("../model/model");
const csv = require("csv-parser");
const csvtojson = require("csvtojson");
const fs = require("fs");
const zlib = require("zlib");
const { query } = require("express");
const router = require("express").Router();
const moment = require("moment");
const fileUploader = require("../lib/uploader");
const result = [];
let finalResult;

router.get("/graph", async (req, res) => {
  try {
    const { cellId, enodebId } = req.query;

    delete query.cellId;
    delete query.enodebId;

    let searchByEnodebId = {};
    if (enodebId) {
      searchByEnodebId = {
        enodebId,
      };
    }

    const findData = await Model.find({
      ...searchByEnodebId,
      cellId: req.query.cellId,
      resultTime: { $lte: req.query.endDate, $gte: req.query.startDate },
    });

    if (!findData.length || !findData) {
      return res.status(404).json({ message: "Can't Find Your Data" });
    }

    const result = findData.map((val) => {
      return {
        resultTime: val.resultTime,
        availability: (val.availDur / 900) * 100,
      };
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post(
  "/upload",
  fileUploader({
    destinationFolder: "data",
    prefix: "DATA",
    fileType: "application",
  }).single("rar_file"),
  async (req, res, next) => {
    const { filename } = req.file;
    const uploadFileDomain = "http://localhost:2000";
    const filePath = "rar_file";

    const inStream = fs.createReadStream(`./src/public/data/${filename}`);

    const outStream = fs.createWriteStream(`./src/public/csv/${filename}.csv`);

    const unzip = zlib.createGunzip();

    inStream
      .pipe(unzip)
      .pipe(outStream)
      .on("finish", () => {
        const enodebFunction = (value) => {
          const temp = value?.split(",")[3];
          return temp?.split("=")[1];
        };

        const cellFunction = (value) => {
          const temp = value?.split(",")[1];
          return temp?.split("=")[1];
        };
        fs.createReadStream(`./src/public/csv/${filename}.csv`)
          .pipe(
            csv({
              headers: ["resultTime", "", "name", "", "availDur"],
            })
          )
          .on("data", (data) => {
            result.push(data);
          })
          .on("end", async () => {
            result.splice(0, 2);
            finalResult = result.map((val) => {
              return {
                resultTime: moment(val.resultTime).format("YYYY-MM-DD"),
                enodebId: enodebFunction(val.name),
                cellId: cellFunction(val.name),
                availDur: val.availDur,
              };
            });
            try {
              const data = await Model.create(finalResult);
              return res
                .status(201)
                .json({ message: "Data Added!", result: data });
            } catch (error) {
              return res.status(400).json({ message: error.message });
            }
          });
      });
  }
);

module.exports = router;
