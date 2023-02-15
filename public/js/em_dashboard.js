const AppRoot = () => {
  const [products, setProducts] = React.useState([]);
  const [totalVentes, setTotalVentes] = React.useState(0);
  const [totalEmployes, setTotalEmployes] = React.useState(0);
  const [ventes, setVentes] = React.useState([]);

  const [carts, setCarts] = React.useState([]);
  const [categorySelectedId, setCategorySelectedId] = React.useState(null);
  const [venteId, setVenteId] = React.useState(null);

  const handleSelectCategory = (id) => {
    setCategorySelectedId(id);
  };

  React.useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      socket.on(`${user_travail_pour}-vente`, (data) => {
        $.notify('Vous avez une nouvelle commande !', 'success');
        const vente = data.vente;

        let vente_exist = false;

        setVentes((prVentes) => {
          if (prVentes.find((v) => v._id === vente._id)) {
            vente_exist = true;
            return prVentes;
          }

          return [...prVentes, vente];
        });

        setProducts((prProducts) => {
          const newProducts = prProducts.map((product) => {
            const index = vente.produit.findIndex(
              (el) => el._id === product._id
            );

            if (index !== -1) {
              const newProduct = { ...product };
              newProduct.quantite -= vente.quantite[index];
              return newProduct;
            } else {
              return product;
            }
          });

          return vente_exist ? prProducts : newProducts;
        });
      });

      socket.on(`${user_travail_pour}-edit-vente`, (data) => {
        const vente = data.vente;
        const quantites = data.quantites;

        setVentes((prVentes) => {
          const newVentes = prVentes.map((el) => {
            if (el._id === vente._id) {
              return vente;
            } else {
              return el;
            }
          });

          return newVentes;
        });

        setProducts((prProducts) => {
          const newProducts = prProducts.map((product) => {
            const index = vente.produit.findIndex(
              (el) => el._id === product._id
            );

            if (index !== -1) {
              const newProduct = { ...product };
              newProduct.quantite -= quantites[index];
              return newProduct;
            } else {
              return product;
            }
          });

          return newProducts;
        });
      });
    });
  }, []);

  React.useEffect(() => {
    setProducts(globalProducts);
    setTotalVentes(Number(sumVentes));
    setTotalEmployes(Number(sumEmployes));
    setVentes(globalVentes);
  }, []);

  const updateTotalVentes = (total) => {
    setTotalVentes((prTotal) => Number(prTotal) + Number(total));
  };

  const confirmVente = (venteId, type) => {
    const vente = ventes.find((el) => el._id === venteId);

    if (
      type === 'Validée' &&
      new Date(vente.createdAt).toLocaleDateString() ===
        new Date().toLocaleDateString()
    ) {
      const total = vente.prix;

      updateTotalVentes(total);
    } else if (type === 'Annulée') {
      setProducts((prProducts) => {
        const newProducts = prProducts.map((product) => {
          const index = vente.produit.findIndex((el) => el._id === product._id);

          if (index !== -1) {
            const newProduct = { ...product };
            newProduct.quantite += vente.quantite[index];
            return newProduct;
          } else {
            return product;
          }
        });

        return newProducts;
      });
    }

    const newVentes = ventes.filter((el) => el._id !== venteId);

    setVentes(newVentes);
  };

  const addProductToCart = (product) => {
    if (product.quantite <= 0) {
      return;
    }

    const cartItem = carts.find((cart) => cart._id === product._id);

    if (cartItem) {
      if (cartItem.quantity + 1 > product.quantite) {
        alert('Vous ne pouvez pas ajouter plus de produits que le stock');
        return;
      }

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
      if (quantity > product.quantite) {
        alert('Vous ne pouvez pas ajouter plus de produits que le stock');
        return;
      }

      cartItem.quantity = quantity;
      setCarts([...carts]);
    } else {
      setCarts([...carts, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateProductQuantity = (product, type) => {
    const cartItem = carts.find((cart) => cart._id === product._id);

    if (cartItem) {
      if (
        type === 'decr' &&
        (cartItem.quantity > 1 ||
          (!!cartItem.quantity_already_sold && cartItem.quantity >= 1))
      ) {
        cartItem.quantity--;
      } else if (type === 'incr') {
        cartItem.quantity++;
      } else if (
        type === 'decr' &&
        cartItem.quantity + (cartItem.quantity_already_sold || 0) === 1
      ) {
        if (!cartItem.quantity_already_sold) {
          removeProductFromCart(cartItem);
          return;
        }
      }

      setCarts([...carts]);
    }
  };

  const clearCarts = () => {
    setCarts([]);
    setVenteId(null);
  };

  const initCarts = (vente) => {
    const carts = [];

    vente.produit.forEach((product, index) => {
      carts.push({
        ...product,
        quantity: 0,
        quantity_already_sold: vente.quantite[index],
      });
    });

    setVenteId(vente._id);
    setCarts(carts);
  };

  return (
    <AppContext.Provider
      value={{ products, totalVentes, totalEmployes, ventes, confirmVente }}
    >
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
          initCarts,
          venteId,
        }}
      >
        <React.Fragment>
          <VenteRoot />
          <EmDashboardBody />
        </React.Fragment>
      </ProductsContext.Provider>
    </AppContext.Provider>
  );
};

ReactDOM.render(<AppRoot />, document.getElementById('root'));
