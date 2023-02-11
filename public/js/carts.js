const CartList = () => {
  const { carts } = React.useContext(ProductsContext);

  return (
    <div className='carts'>
      <h4>Panier</h4>
      <div className='carts-list'>
        {carts.map((product) => {
          return <CartItem key={product._id} product={product} />;
        })}
      </div>
      <CartFooter />
    </div>
  );
};

const CartItem = ({ product }) => {
  const { handleUpdateProductQuantity, updateProductQuantity } =
    React.useContext(ProductsContext);
  return (
    <div className='cart-item'>
      <div className='cart-item__details'>
        <img src={product.produit.image} alt='product' />
        <div>
          <h6>
            {product.quantity}x {product.produit.nom_produit}
          </h6>
          <p>{product.prix_vente} FCFA</p>
        </div>
      </div>
      <div className='cart-item__actions'>
        <button
          className='btn btn-danger decr'
          onClick={() => handleUpdateProductQuantity(product, 'decr')}
        >
          -
        </button>

        <span
          className='quantity'
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            updateProductQuantity(
              product,
              Number(e.target.textContent) || product.quantity
            )
          }
        >
          {product.quantity}
        </span>
        <button
          className='btn btn-valider incr'
          onClick={() => handleUpdateProductQuantity(product, 'incr')}
        >
          +
        </button>
      </div>
    </div>
  );
};

const CartFooter = () => {
  const { carts, clearCarts } = React.useContext(ProductsContext);
  const [sommeEncaisse, setSommeEncaisse] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const total = carts.reduce(
    (acc, produit) => acc + produit.prix_vente * produit.quantity,
    0
  );

  const handleSubmit = () => {
    if (loading) return;

    const vente = {
      produit: carts.map((prod) => prod._id),
      quantite: carts.map((prod) => prod.quantity),
      somme_encaisse: Number(sommeEncaisse),
    };

    if (!vente.somme_encaisse)
      return alert('Veuillez saisir la somme encaissée');

    if (vente.somme_encaisse < total)
      return alert('La somme encaissée est insuffisante');

    setLoading(true);

    fetch('/vente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vente),
    })
      .then((res) => res.json())
      .then((data) => {
        clearCarts();
        setSommeEncaisse(0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert('Une erreur est survenue');
        setLoading(false);
      });
  };

  return (
    <div className='carts-footer'>
      <h4>
        Total: {total}
        FCFA
      </h4>
      <input
        type='number'
        placeholder='Somme encaissé'
        className='form-control mb-1'
        value={sommeEncaisse}
        onChange={(e) => setSommeEncaisse(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className='btn btn-valider'
        disabled={loading || carts.length === 0}
      >
        {loading ? 'En cours...' : 'Valider'}
      </button>
    </div>
  );
};
