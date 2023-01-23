// ( (nombre final - nombre initial) / nombre initial ) * 100
//
exports.getPercent = (initial, final) => {
  if (initial === 0 && final === 0) return 0;

  if (initial === 0) return 100;

  return ((final - initial) / initial) * 100;
};
