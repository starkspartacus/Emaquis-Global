const ProductList = () => {
  const [products, setProducts] = React.useState([]);

  const { categorySelectedId } = React.useContext(ProductsContext);
  const { products: allProducts } = React.useContext(AppContext);

  React.useEffect(() => {
    const prods = (allProducts || []).filter(
      (prod) => prod.produit.categorie._id === categorySelectedId
    );
    setProducts(prods);
  }, [categorySelectedId, allProducts]);

  return (
    <div className="product-list">
      <h4>Produits</h4>
      <div className="product-list__grid">
        {products.map((product) => {
          return <ProductCard key={product._id} product={product} />;
        })}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addProductToCart } = React.useContext(ProductsContext);

  return (
    <div className="product-card">
      <h4 className="badge emTaille taille_produits">{product.taille}</h4>
      <div className="product-card__image">
        <img src={product.produit.image} alt="product" />
      </div>
      <div className="product-card__details">
        <h4>{product.produit.nom_produit}</h4>
        <p className="emPriceproduct">{product.prix_vente} FCFA</p>
        {product.quantite > 0 && (
          <p>
            Stock:{" "}
            <span
              style={{
                color:
                  product.quantite >= 100
                    ? "rgb(47, 204, 47)"
                    : "rgb(219, 36, 23)",
              }}
            >
              {product.quantite}
            </span>
          </p>
        )}
        {product.quantite === 0 && <p className="">Rupture de stock</p>}
      </div>
      <div
        className="product-card__actions"
        onClick={() => addProductToCart(product)}
      >
        <button className="btn ">Ajouter</button>
      </div>
      {product.quantite === 0 && <div className="product-overlay" />}
    </div>
  );
};
