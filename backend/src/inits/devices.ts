//@ts-ignore
const db = require("../services/db");

const deviceInit = async () => {
  const query = `CREATE TABLE IF NOT EXISTS device (
        id INT PRIMARY KEY AUTO_INCREMENT,
        brand VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        serialNumber VARCHAR(100) NOT NULL,
        typ VARCHAR(50) NOT NULL,
        amount INT NOT NULL,
        employee_id INT,
        FOREIGN KEY (employee_id) REFERENCES employee (id)
    )`;

  try {
    const results = await db.query(query);
    if (results) {
      console.log("Success in creating device table");
      return { message: "Success in creating device table" };
    } else {
      const err = new Error();
      console.log(err);
    }
  } catch (error) {
    console.error("Error in creating device table: ", error);
  }
};

module.exports = deviceInit;
