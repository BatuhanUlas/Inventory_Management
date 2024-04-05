const dbq = require("../services/db");

const employeeInit = async () => {
  const query = `CREATE TABLE IF NOT EXISTS employee (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL,
        lastname VARCHAR(30) NOT NULL,
        salutation VARCHAR(30) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        employeeNumber INT NOT NULL,
        token text,
        right_id INT,
        FOREIGN KEY (right_id) REFERENCES rights (id)
    )`;

  try {
    const results = await dbq.query(query);
    if (results) {
      console.log("Success in creating employee table");
      return { message: "Success in creating employee table" };
    } else {
      const err = new Error();
      console.error(err);
    }
  } catch (error) {
    console.error("Error in creating employee table:", error);
  }
};

module.exports = employeeInit;
