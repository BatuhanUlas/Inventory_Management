const getOffset = (currentPage = 1, listPerPage: number) => {
  return (currentPage - 1) * +[listPerPage];
};

const emptyOrRow = (rows: []) => {
  if (!rows) {
    return [];
  }
  return rows;
};

module.exports = {
  getOffset,
  emptyOrRow,
};
