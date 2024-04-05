import { Rights } from "../types/rights";
import { Result } from "../types/result";

const db = require("./db");
const helper = require("../helper");
const cnf = require("../config");

let query: string = "";

const getMultiple = async (page = 1) => {
  const offset = helper.getOffset(page, cnf.listPerPage);
  query = `SELECT * FROM rights LIMIT ?,?`;
  const values = [offset, cnf.listPerPage];

  const rows = await db.query(query, values);
  const data = helper.emptyOrRow(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
};

const create = async (rightsData: Rights) => {
  //Error Handling
  //Check if Right exists
  const rightExists = `SELECT * FROM rights WHERE name=?`;
  let values = [rightsData.name];
  const [rows] = await db.query(rightExists, values);
  if (rows) {
    return { message: "Right exists" };
  }

  query = `INSERT INTO rights (name) VALUES (?)`;
  values = [rightsData.name];

  if (!rightsData.name) {
    return { message: "Field is empty" };
  }
  const result = await db.query(query, values);

  const message = result.affectedRows
    ? "Right was created successfully"
    : "Error in creating Right";
  return { message, values };
};

const read = async (id: number) => {
  query = `SELECT * FROM rights WHERE id = ?`;
  const values = [id];

  const rows = await db.query(query, values);
  let message = `Error in reading right`;

  if (rows.length > 0) {
    return rows;
  } else {
    message = `No right with id = ${id} found`;
  }

  return { message };
};

const update = async (id: number, right: Rights) => {
  query = `UPDATE rights SET name = ?`;
  const values = [right.name];

  const result: Result = await db.query(query, values);
  const message = result.affectedRows
    ? `Right with id ${id} updated successfully`
    : `No Right with id=${id} was found`;

  return { message };
};

const remove = async (id: number) => {
  query = `DELETE FROM rights WHERE id=?`;
  const values = [id];

  const result: Result = await db.query(query, values);

  const message = result.affectedRows
    ? `Right with id=${id} was deleted successfully`
    : `No Right with id=${id} was found`;

  return { message };
};

module.exports = {
  getMultiple,
  create,
  read,
  update,
  remove,
};
