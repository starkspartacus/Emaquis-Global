const formatAmount = (montant) => {
  const tab = ('' + (montant > 0 ? montant : ('' + montant).slice(1)))
    .split('')
    .reverse();
  let d = 3;
  for (let i = 0; i < tab.length; i++) {
    if (d + 1 > tab.length) {
      break;
    }
    if (tab.length >= 11) {
      tab.splice(d === 3 ? d : d + i, 0, '.');
    } else {
      tab.splice(d === 3 ? d : d + 1, 0, '.');
    }

    d += 3;
  }
  tab.reverse();
  while (tab[0] === '.') {
    tab.splice(0, 1);
  }
  return (
    (isNaN(montant) || '' + montant === '0'
      ? '0'
      : (montant >= 0 ? '' : '-') + tab.join('')) + ' FCFA'
  );
};

module.exports = {
  formatAmount,
};
