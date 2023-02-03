const ProductsContext = React.createContext({
  carts: [],
  addProductToCart: () => {},
  removeProductFromCart: () => {},
  updateProductQuantity: () => {},
  handleSelectCategory: () => {},
  clearCart: () => {},
});
