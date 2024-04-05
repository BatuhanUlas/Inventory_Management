const mysql2 = require("mysql2/promise");
const cnfs = require("../config");

const query = async (sql: string, params: string) => {
  const connection = await mysql2.createConnection(cnfs.db);
  const [results] = await connection.execute(sql, params);

  return results;
};

module.exports = {
  query,
};
