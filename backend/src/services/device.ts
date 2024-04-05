import { Device } from "../types/device";
import { Employee } from "../types/employee";
import { Result } from "../types/result";
import { Response } from "express";
const db = require("./db");
const helper = require("../helper");
const cnf = require("../config");

const getMultiple = async (res: Response, page = 1) => {
  try {
    const offset = helper.getOffset(page, cnf.listPerPage);
    const query = `SELECT * FROM device LIMIT ?,?`;
    const values = [offset, cnf.listPerPage];
    const result = await db.query(query, values);
    const data = helper.emptyOrRow(result);
    const meta = { page };
    return [{ data, meta }];
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in retrieving devices" });
  }
};

const create = async (employeeId: number, device: Device) => {
  try {
    const { typ, serialNumber, brand, model, amount } = device;
    const query = `INSERT INTO device (typ, serialNumber, brand, model, amount, employee_id) VALUES (?,?,?,?,?,?)`;
    const values = [typ, serialNumber, brand, model, amount, employeeId];
    const result = await db.query(query, values);

    if (result.affectedRows === 0) {
      return { message: `Error in creating device`, value: null };
    }

    return {
      message: `Device was created successfully`,
      data: {
        id: result.insertId,
        typ: typ,
        serialNumber: serialNumber,
        brand: brand,
        model: model,
        amount: amount,
        employee: employeeId,
      },
    };
  } catch (err) {
    console.error(err);
    return { data: [], message: "Error in creating device" };
  }
};

const read = async (employeeId: number, deviceId: number) => {
  const query = `SELECT * FROM device WHERE employee_id = ? AND id = ? `;
  const values = [employeeId, deviceId];

  const rows = await db.query(query, values);
  let message = `Error in reading device`;

  if (rows.length > 0) {
    return rows;
  } else {
    message = `No Device with id= ${deviceId} found`;
  }
  return { message };
};

const update = async (id: number, device: Device) => {
  const query = `UPDATE device SET typ = ?, serialNumber = ?, brand = ?, model = ?, amount = ? WHERE id = ?`;
  const values = [
    device.typ,
    device.serialNumber,
    device.brand,
    device.model,
    device.amount,
    id,
  ];

  const result: Result = await db.query(query, values);
  const message = result.affectedRows
    ? `Device with id=${id} updated successfully`
    : `No Device with id=${id} was found`;
  return { message };
};

const remove = async (id: number) => {
  try {
    const query = `DELETE FROM device WHERE id = ?`;
    const result: Result = await db.query(query, [id]);
    const message = result.affectedRows
      ? `Device with id=${id} was deleted successfully`
      : `No device with id=${id} was found`;

    return { data: [], message: message };
  } catch (err) {
    console.error("Error while deleting Device", err);
    return { message: err };
  }
};

module.exports = {
  getMultiple,
  create,
  read,
  update,
  remove,
};

export {};
