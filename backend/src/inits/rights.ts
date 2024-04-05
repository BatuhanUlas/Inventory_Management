//@ts-ignore
const db = require("../services/db");

const rightsInit = async () => {
  const query = `CREATE TABLE IF NOT EXISTS rights (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL
    )`;

  try {
    const results = await db.query(query);
    if (results) {
      console.log("Success in creating rights table");
      return { message: "Success in creating rights table" };
    } else {
      const err = new Error();
      console.error(err);
    }
  } catch (error) {
    console.error("Error in creating rights table: ", error);
  }
};

module.exports = rightsInit;
