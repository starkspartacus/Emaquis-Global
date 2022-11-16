const helperConverStrToArr = (str) => {
  return typeof str === "string" ? [str] : str;
};

module.exports = {
  helperConverStrToArr,
};
