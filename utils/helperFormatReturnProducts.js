exports.helperFormatReturnProducts = (products) => {
  return products
    .map((p) => ({
      ...p._doc,
      dateline: moment(p.dateline).format('DD/MM/YYYY'),
      code: ('' + p._id).slice(-6).toUpperCase(),
      tipId: p._id,
    }))
    .reduce((acc, prodReturn) => {
      const products = prodReturn.produit.map((prod, index) => {
        const {
          dateline,
          product_return_type,
          stock_return,
          confirm,
          client_name,
          code,
          tipId,
        } = prodReturn;
        return {
          ...prod._doc,
          quantite: prodReturn.quantite[index],
          dateline,
          product_return_type,
          stock_return,
          confirm,
          client_name,
          isReturnProduct: true,
          code,
          tipId,
        };
      });

      return [...acc, ...products];
    }, []);
};
