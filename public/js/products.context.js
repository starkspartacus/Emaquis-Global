const AppContext = React.createContext({
  products: [],
  ventes: [],
});

const ProductsContext = React.createContext({
  carts: [],
  addProductToCart: () => {},
  removeProductFromCart: () => {},
  updateProductQuantity: () => {},
  handleSelectCategory: () => {},
  clearCart: () => {},
});
