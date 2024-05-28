const calculPromoTotal = (produit, quantity) => {
  return (
    parseInt(quantity / produit.promo_quantity) * produit.promo_price +
    (quantity % produit.promo_quantity) * produit.prix_vente
  );
};

module.exports = {
  calculPromoTotal,
};
