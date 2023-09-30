const ProductList = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { categorySelectedId } = React.useContext(ProductsContext);
  const { products: allProducts } = React.useContext(AppContext);

  React.useEffect(() => {
    if (categorySelectedId === 'tip') {
      (async () => {
        setLoading(true);
        const res = await fetch('/retourner-produit-valid');
        const data = await res.json();

        if (data.data) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })();
      return;
    }

    const prods = (allProducts || []).filter((prod) =>
      categorySelectedId === 'formule'
        ? prod.promo
        : prod.produit.categorie._id === categorySelectedId
    );
    setProducts(prods);
  }, [categorySelectedId, allProducts]);

  return (
    <div className='product-list'>
      <h4>Produits</h4>
      <div className='product-list__grid'>
        {loading && <p>Chargement...</p>}
        {!loading &&
          products.map((product) => {
            return <ProductCard key={product._id} product={product} />;
          })}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addProductToCart } = React.useContext(ProductsContext);
  const { billet } = React.useContext(AppContext);

  return (
    <div className='product-card'>
      <div className='d-flex justify-content-between'>
        <h4 className='badge emTaille taille_produits'>{product.taille}</h4>
        {product.promo && (
          <h4 className='badge formule'>
            {product.promo_quantity} x {product.promo_price}
          </h4>
        )}
      </div>

      <div className='product-card__image'>
        <img src={product.produit.image} alt='product' />
      </div>
      <div className='product-card__details'>
        <h4
          data-toggle='tooltip'
          data-placement='top'
          title={product.produit.nom_produit + ' ' + product.taille}
        >
          {product.produit.nom_produit}
        </h4>
        {!product.isReturnProduct && (
          <p className='emPriceproduct'>{`${product.prix_vente} FCFA`}</p>
        )}

        {product.quantite > 0 && (
          <p>
            {product.isReturnProduct ? 'Quantité' : 'Stock'}:{' '}
            <span
              style={{
                color:
                  product.quantite >= 100
                    ? 'rgb(47, 204, 47)'
                    : 'rgb(219, 36, 23)',
              }}
            >
              {product.quantite}
            </span>
          </p>
        )}
        {!product.isReturnProduct && product.quantite === 0 && (
          <p className=''>Rupture de stock</p>
        )}
        {product.isReturnProduct && (
          <p className=''>Expire: le {product.dateline}</p>
        )}
        {product.isReturnProduct && !!product.client_name && (
          <p className=''>Client: {product.client_name}</p>
        )}
        {product.isReturnProduct && !!product.client_name && (
          <p className=''>Code: {product.code}</p>
        )}
      </div>
      {!product.isReturnProduct && (
        <div
          className='product-card__actions'
          onClick={() =>
            billet && !billet.is_closed ? addProductToCart(product) : null
          }
        >
          <button
            className='btn'
            disabled={!billet || (billet && billet.is_closed)}
          >
            Ajouter
          </button>
        </div>
      )}
      {product.quantite === 0 && <div className='product-overlay' />}
    </div>
  );
};
