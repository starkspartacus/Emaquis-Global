const AddVente = () => {
  return (
    <div className='vente'>
      <Categories />
      <ProductList />
      <CartList />
    </div>
  );
};

const AppRoot = () => {
  const [carts, setCarts] = React.useState([]);
  const [categorySelectedId, setCategorySelectedId] = React.useState(null);

  const addProductToCart = (product) => {
    const cartItem = carts.find((cart) => cart._id === product._id);
    if (cartItem) {
      cartItem.quantity++;
      setCarts([...carts]);
    } else {
      setCarts([...carts, { ...product, quantity: 1 }]);
    }
  };

  const removeProductFromCart = (product) => {
    const cartItem = carts.find((cart) => cart._id === product._id);
    if (cartItem) {
      setCarts([...carts].filter((cart) => cart._id !== product._id));
    }
  };

  const updateProductQuantity = (product, quantity) => {
    const cartItem = carts.find((cart) => cart._id === product._id);
    if (cartItem) {
      cartItem.quantity = quantity;
      setCarts([...carts]);
    } else {
      setCarts([...carts, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateProductQuantity = (product, type) => {
    const cartItem = carts.find((cart) => cart._id === product._id);
    if (cartItem) {
      if (type === 'decr' && cartItem.quantity > 1) {
        cartItem.quantity--;
      } else if (type === 'incr') {
        cartItem.quantity++;
      }

      if (cartItem.quantity === 1) {
        removeProductFromCart(cartItem);
      } else {
        setCarts([...carts]);
      }
    }
  };

  const clearCarts = () => {
    setCarts([]);
  };

  const handleSelectCategory = (id) => {
    setCategorySelectedId(id);
  };

  return (
    <ProductsContext.Provider
      value={{
        carts,
        setCarts,
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        categorySelectedId,
        handleSelectCategory,
        handleUpdateProductQuantity,
        clearCarts,
      }}
    >
      <AddVente />
    </ProductsContext.Provider>
  );
};

ReactDOM.render(<AppRoot />, document.getElementById('add_vente'));
