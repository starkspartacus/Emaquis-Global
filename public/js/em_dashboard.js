const AppRoot = () => {
  const [products, setProducts] = React.useState([]);
  const [totalVentes, setTotalVentes] = React.useState(0);
  const [totalEmployes, setTotalEmployes] = React.useState(0);
  const [ventes, setVentes] = React.useState([]);

  React.useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      socket.on(`${user_travail_pour}-vente`, (data) => {
        $.notify("Vous avez une nouvelle commande !", "success");
        const vente = data.vente;

        setVentes((prVentes) => {
          const newVentes = [...prVentes, vente];
          return newVentes;
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
      type === "Validée" &&
      new Date(vente.createdAt).toLocaleDateString() ===
        new Date().toLocaleDateString()
    ) {
      const total = vente.prix;

      updateTotalVentes(total);
    } else if (type === "Annulée") {
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

  return (
    <AppContext.Provider
      value={{ products, totalVentes, totalEmployes, ventes, confirmVente }}
    >
      <React.Fragment>
        <VenteRoot />
        <EmDashboardBody />
      </React.Fragment>
    </AppContext.Provider>
  );
};

ReactDOM.render(<AppRoot />, document.getElementById("root"));
