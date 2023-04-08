exports.generateQuantityByLocker = (locker, size) => {
  console.log({ locker, size }, 'locker, size');
  if (!locker || !size) return 1;

  if (['50cl', '60cl', '65cl'].includes(size)) {
    return locker * 12;
  } else if (['30cl', '33cl'].includes(size)) {
    return locker * 24;
  } else if (['100cl'].includes(size)) {
    return locker * 100;
  }

  return 12;
};
