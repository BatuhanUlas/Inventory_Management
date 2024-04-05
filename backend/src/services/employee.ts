import { Device } from "../types/device";
import { Employee } from "../types/employee";
import { Result } from "../types/result";
import { Request, Response } from "express";

const db = require("./db");
const helper = require("../helper");
const cnf = require("../config");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cnfAuth = require("../config/auth.config");

let query: string = "";

const getMultiple = async (page = 1) => {
  const offset = helper.getOffset(page, cnf.listPerPage);
  const query = `SELECT * FROM employee LIMIT ?,?`;
  const values = [offset, cnf.listPerPage];

  const rows = await db.query(query, values);
  const employees: Employee[] = helper.emptyOrRow(rows);

  for (const employee of employees) {
    const device = `SELECT * FROM device WHERE employee_id = ?`;
    const deviceValues = [employee.id];
    const deviceRows = await db.query(device, deviceValues);
    const devices = helper.emptyOrRow(deviceRows);

    employee.devices = devices;
  }
  const meta = { page };

  return {
    data: employees,
    meta,
  };
};

const readCheckRights = async (token: string) => {
  try {
    const findEmployee = `SELECT * FROM employee WHERE token=?`;
    const check = [token];
    const employee: Employee[] = await db.query(findEmployee, check);

    if (employee.length === 0) {
      return { message: "Employee not found" };
    }
    let values: any;
    if (employee[0].right_id === 1) {
      query = `SELECT * FROM employee`;
      values = [];

      const rows = await db.query(query);
      const employees: Employee[] = helper.emptyOrRow(rows);

      for (const employeeWithDevices of employees) {
        const device = `SELECT * FROM device WHERE employee_id = ?`;
        const deviceValues = [employeeWithDevices.id];
        const deviceRows = await db.query(device, deviceValues);
        const devices = helper.emptyOrRow(deviceRows);

        employeeWithDevices.devices = devices;
      }

      const employeeWithDevies = employees.map((employee) => ({
        id: employee.id,
        email: employee.email,
        employeeNumber: employee.employeeNumber,
        name: employee.name,
        lastname: employee.lastname,
        right_id: employee.right_id,
        salutation: employee.salutation,
        devices: employee.devices,
      }));
      return { data: employeeWithDevies };
    } else if (employee[0].right_id === 2) {
      query = `SELECT * FROM employee WHERE id=?`;
      values = [employee[0].id];

      const rows = await db.query(query, values);
      const employees: Employee[] = helper.emptyOrRow(rows);

      for (const employeeWithDevices of employees) {
        const device = `SELECT * FROM device WHERE employee_id = ?`;
        const deviceValues = [employeeWithDevices.id];
        const deviceRows = await db.query(device, deviceValues);
        const devices = helper.emptyOrRow(deviceRows);

        employeeWithDevices.devices = devices;
      }
      const employeeWithDevies = employees.map((employee) => ({
        id: employee.id,
        email: employee.email,
        employeeNumber: employee.employeeNumber,
        name: employee.name,
        lastname: employee.lastname,
        right_id: employee.right_id,
        salutation: employee.salutation,
        devices: employee.devices,
      }));

      return { data: employeeWithDevies };
    } else {
      throw new Error("Invalid rights_id");
    }
  } catch (err) {
    console.log(err);
    return { message: "Error in reading rights employee" };
  }
};

// const search = async (searchString: string) => {
//   try {
//     const searchQuery = `SELECT e.name AS employee_name, e.lastname AS
//     employee_lastname, e.employeeNumber, d.brand, d.model, d.serialNumber,
//     d.typ FROM employee e LEFT JOIN device d ON e.id = d.employee_id WHERE
//     e.name LIKE ? OR e.lastname LIKE ? OR e.employeeNumber LIKE
//     ? OR d.typ LIKE ? OR d.brand LIKE ?
//     OR d.model LIKE ? OR d.serialNumber LIKE ?`;
//     const values = Array(7).fill(`%${searchString}%`);

//     const result: any = await db.query(searchQuery, values);

//     if (result && result.length > 0) {
//       const data = result.map((row: any) => ({
//         employeeName: row.employee_name,
//         employeeLastname: row.employee_lastname,
//         employeeNumber: row.employeeNumber,
//         brand: row.brand,
//         model: row.model,
//         serialNumber: row.serialNumber,
//         type: row.typ,
//       }));
//       return { data: data, message: "test" };
//     }
//     const message = result.affectedRows ? "" : "Error in searching";
//   } catch (err) {
//     console.log(err);
//     return { message: "Error in searching" };
//   }
// };

const search = async (searchString: string) => {
  try {
    const searchQuery = `
      SELECT e.id AS employee_id, e.name, e.lastname, e.salutation, e.email, e.employeeNumber, e.right_id,
             d.id AS device_id, d.typ, d.serialNumber, d.brand, d.model, d.amount, d.employee_id AS device_employee_id
      FROM employee e
      LEFT JOIN device d ON e.id = d.employee_id
      WHERE e.name LIKE ? OR e.lastname LIKE ? OR e.employeeNumber LIKE ? OR d.typ LIKE ? OR d.brand LIKE ? OR d.model LIKE ? OR d.serialNumber LIKE ?
    `;
    const values = Array(7).fill(`%${searchString}%`);

    const result: Result[] = await db.query(searchQuery, values);

    if (result && result.length > 0) {
      const formattedData = result.reduce((acc: any, row: any) => {
        const existingEmployee = acc.find(
          (item: any) => item.id === row.employee_id
        );
        if (existingEmployee) {
          existingEmployee.devices.push({
            id: row.device_id,
            typ: row.typ,
            serialNumber: row.serialNumber,
            brand: row.brand,
            model: row.model,
            amount: row.amount,
            employee_id: row.device_employee_id,
          });
        } else {
          acc.push({
            id: row.employee_id,
            name: row.name,
            lastname: row.lastname,
            salutation: row.salutation,
            email: row.email,
            employeeNumber: row.employeeNumber,
            devices: [
              {
                id: row.device_id,
                typ: row.typ,
                serialNumber: row.serialNumber,
                brand: row.brand,
                model: row.model,
                amount: row.amount,
                employee_id: row.device_employee_id,
              },
            ],
            right_id: row.right_id,
          });
        }
        return acc;
      }, []);

      return { data: formattedData, message: "" };
    } else {
      return { data: [], message: "No results found" };
    }
  } catch (err) {
    console.error(err);
    return { data: [], message: "Error in searching" };
  }
};
const create = async (employeeData: Employee, res: Response) => {
  //Error Handling
  //Check if Employee exists
  try {
    const employeeExists = `SELECT * FROM employee WHERE email=?`;
    let values = [employeeData.email];
    const [rows] = await db.query(employeeExists, values);
    if (rows) {
      return { message: "Employee exists" };
    }

    const {
      name,
      lastname,
      salutation,
      email,
      password,
      employeeNumber,
      right_id,
    } = employeeData;

    const hashedPassword = await bcryptjs.hash(password, 10); //Password encrypt

    query = `INSERT INTO employee (name, lastname, salutation, email, password, employeeNumber, right_id) VALUES (?,?,?,?,?,?,?)`;
    values = [
      name,
      lastname,
      salutation,
      email,
      hashedPassword,
      employeeNumber,
      right_id,
    ];

    if (
      !name ||
      !lastname ||
      !salutation ||
      !email ||
      !password ||
      !employeeNumber ||
      !right_id
    ) {
      return { message: "Field is empty" };
    }

    const result = await db.query(query, values);

    const createdEmployee = {
      id: result.insertId,
      name: employeeData.name,
      lastname: employeeData.lastname,
      email: employeeData.email,
      salutation: employeeData.salutation,
      password: employeeData.password,
      employeeNumber: employeeData.employeeNumber,
      right_id: employeeData.right_id,
    };

    const message = result.affectedRows
      ? "Employee was created successfully"
      : "Error in creating Employee";

    return { data: createdEmployee, message };
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in creating Employee" });
  }
};

const read = async (id: number) => {
  try {
    query = `SELECT * from employee WHERE id = ?`;
    const values = [id];

    const rows = await db.query(query, values);
    const employee: Employee[] = helper.emptyOrRow(rows);

    for (const employeeWithDevice of employee) {
      const device = `SELECT * FROM device WHERE employee_id = ?`;
      const deviceValues = [employeeWithDevice.id];
      const deviceRows = await db.query(device, deviceValues);
      const devices = helper.emptyOrRow(deviceRows);

      employeeWithDevice.devices = devices;
      return { employeeWithDevice };
    }
    let message = `Error in reading employee`;

    if (rows.length > 0) {
      return rows;
    } else {
      message = `No employee with id = ${id} found`;
    }
    return { message };
  } catch (err) {
    console.log("Error in reading Employee", err);
    return "Error in reading Employee";
  }
};

const login = async (email: string, password: string, res: Response) => {
  try {
    query = `SELECT * FROM employee WHERE email=?`;
    const values = [email];

    const rows = await db.query(query, values);

    if (rows.length >= 1) {
      const match = await bcryptjs.compare(password, rows[0].password);
      if (match) {
        const token = jwt.sign({ email: email }, process.env.JWT_KEY, {
          expiresIn: "24h",
        });
        query = `UPDATE employee SET token = ? WHERE email = ?`;
        const values = [token, email];
        const rows = await db.query(query, values);

        return res
          .status(200)
          .json({ data: { token: token }, message: "Auth success" });
      } else {
        return res.status(401).json({ message: "Wrong Password" });
      }
    } else {
      return res.status(401).json({
        data: [],
        message: `No employee with email = ${email} found`,
      });
    }
  } catch (err) {
    console.log("Error in login", err);
    return { message: err };
  }
};

const resetPassword = async (
  email: string,
  employeeNumber: string,
  newPassword: string,
  res: Response
) => {
  try {
    const findEmployee = `SELECT * FROM employee WHERE email=? AND employeeNumber=?`;
    const values = [email, employeeNumber];
    const employeeCheck: Employee[] = await db.query(findEmployee, values);
    console.log(employeeCheck);

    if (employeeCheck.length === 0) {
      return { message: "Employee not found" };
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const updatePasswordQuery = `UPDATE employee SET password=? WHERE email=? AND employeeNumber=?`;
    const updatePasswordValues = [hashedPassword, email, employeeNumber];
    await db.query(updatePasswordQuery, updatePasswordValues);

    return res.status(200).json({ message: "Passwort erfolgreich geändert" });
  } catch (err) {
    console.error("Error while reseting Password", err);
    return res.status(500).json({ message: "Error while reseting Password" });
  }
};

const update = async (id: number, employee: Employee, token: string) => {
  console.log({
    id: id,
    employee: employee,
    token: token,
    devices: employee.devices,
  });
  try {
    const findEmployee = `SELECT * FROM employee WHERE token=?`;
    const check = [token];
    const employeeCheck: Employee[] = await db.query(findEmployee, check);

    if (employeeCheck.length === 0) {
      return { message: "Employee not found" };
    }

    if (employeeCheck[0].right_id === 1) {
      query = `UPDATE employee SET name = ?, lastname = ?, email = ?, salutation = ?, employeeNumber = ? WHERE id=?`;
      const values = [
        employee.name,
        employee.lastname,
        employee.email,
        employee.salutation,
        employee.employeeNumber,
        id,
      ];
      const result: Result = await db.query(query, values);
      const message = result.affectedRows
        ? `Employee ${employee.email} with id=${id} updated successfully`
        : `No Employee with id=${id} was found`;

      if (employee.devices.length === 0) {
        return { data: [], message: "No Devices" };
      } else {
        // Füge das Gerät zur Datenbank hinzu
        for (const device of employee.devices) {
          const { typ, serialNumber, brand, model, amount, employee_id } =
            device;
          const query = `INSERT INTO device (typ, serialNumber, brand, model, amount, employee_id) VALUES (?,?,?,?,?,?)`;
          const values = [typ, serialNumber, brand, model, amount, employee_id];
          const result = await db.query(query, values);

          if (result.affectedRows === 0) {
            return { message: `Error in creating device`, value: null };
          }
        }
        return {
          data: {
            name: employee.name,
            lastname: employee.lastname,
            salutation: employee.salutation,
            email: employee.email,
            employeeNumber: employee.employeeNumber,
          },
          message,
        };
      }
    } else if (employeeCheck[0].right_id === 2) {
      query = `UPDATE employee SET name = ?, lastname = ?, email = ?, salutation = ?, employeeNumber = ? WHERE token= ?`;
      const values = [
        employee.name,
        employee.lastname,
        employee.email,
        employee.salutation,
        employee.employeeNumber,
        token,
      ];
      const result: Result = await db.query(query, values);
      const message = result.affectedRows
        ? `Employee ${employee.email} with id=${employeeCheck[0].id} updated successfully`
        : `No Employee with id=${id} was found`;

      return {
        message,
        values: {
          name: employee.name,
          lastname: employee.lastname,
          salutation: employee.salutation,
          email: employee.email,
          employeeNumber: employee.employeeNumber,
        },
      };
    } else {
      console.log("Error in updating Employee");
      return { message: "Error in updating Employee" };
    }
  } catch (err) {
    console.error("Error in updating Employee", err);
    return { err: err };
  }
};

const remove = async (id: number) => {
  try {
    //check Employee exists
    const findEmployee = `SELECT * FROM employee WHERE id = ?`;
    let values = [id];
    const employee: Employee[] = await db.query(findEmployee, values);

    if (employee.length === 0) {
      return { message: `No employee with id=${id} was found` };
    }

    //deleting foreign key from rights
    const deleteRights = `UPDATE employee SET right_id = NULL WHERE id= ?`;
    await db.query(deleteRights, values);

    //deleting foreign key from devices
    const deleteDevicesQuery = `DELETE FROM device WHERE employee_id = ?`;
    await db.query(deleteDevicesQuery, values);

    //deleting employee
    const deleteEmployee = `DELETE FROM employee WHERE id=?`;
    const result: Result = await db.query(deleteEmployee, values);

    const message = result.affectedRows
      ? `Employee with id=${id} was deleted successfully`
      : `No employee with id=${id} was found`;

    return { message };
  } catch (err) {
    console.log("Error in deleting Employee", err);
    return { err };
  }
};

module.exports = {
  getMultiple,
  create,
  read,
  search,
  login,
  update,
  remove,
  resetPassword,
  readCheckRights,
};

export {};
