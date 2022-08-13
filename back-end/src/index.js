require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/routes");

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("MongoDB Connected");
});

const app = express();

app.use(cors());
app.use(express.json());

app.listen(2000, () => {
  console.log(`Server Started at PORT: 2000`);
});
app.use("/rar_file", express.static(`${__dirname}/public/data`));
app.use("/csv", express.static(`${__dirname}/public/csv`));
app.use("/api", routes);
