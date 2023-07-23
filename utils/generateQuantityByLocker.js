exports.generateQuantityByLocker = ({ locker, size, produit, stockType }) => {
  if (!locker || !size) return 1;

  if (
    stockType === 'cardboard' &&
    produit.nom_produit?.toLowerCase()?.includes('canette')
  ) {
    return locker * 24;
  }

  if (['50cl', '60cl', '65cl'].includes(size)) {
    return locker * 12;
  } else if (['30cl', '33cl', '25cl'].includes(size)) {
    return locker * 24;
  } else {
    if (produit.nom_produit === 'VALPIERRE') {
      return locker * 12;
    } else {
      return locker * 6;
    }
  }
};
