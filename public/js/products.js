const ProductList = () => {
  const [products, setProducts] = React.useState([]);

  const { categorySelectedId } = React.useContext(ProductsContext);

  React.useEffect(() => {
    const prods = (globalProducts || []).filter(
      (prod) => prod.produit.categorie._id === categorySelectedId
    );
    setProducts(prods);
  }, [categorySelectedId]);

  return (
    <div className='product-list'>
      <h4>Products</h4>
      <div className='product-list__grid'>
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
    <div className='product-card'>
      <div className='product-card__image'>
        <img src={product.produit.image} alt='product' />
      </div>
      <div className='product-card__details'>
        <h4>{product.produit.nom_produit}</h4>
        <p>{product.prix_vente} FCFA</p>
      </div>
      <div
        className='product-card__actions'
        onClick={() => addProductToCart(product)}
      >
        <button className='btn btn-success'>Ajouter</button>
      </div>
    </div>
  );
};
