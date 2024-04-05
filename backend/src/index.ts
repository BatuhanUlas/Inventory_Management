import { NextFunction, Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

//Module imports
const employee = require("./routes/employee");
const device = require("./routes/device");
const right = require("./routes/rights");
const employeeInit = require("./inits/employee");
const deviceInit = require("./inits/devices");
const rightInit = require("./inits/rights");

app.use(express.json());
app.use(express.static(`src/uploads`));
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (res: Response) => {
  res.json({ message: "ok" });
});

app.use("/init/employee", employeeInit);
app.use("/init/device", deviceInit);
app.use("/init/right", rightInit);

app.use("/employee", employee);
app.use("/device", device);
app.use("/right", right);

//check Type of err
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log("App listening at https:localhost:4000");
});
