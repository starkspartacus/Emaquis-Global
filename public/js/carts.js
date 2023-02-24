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
  const {
    handleUpdateProductQuantity,
    updateProductQuantity,
    removeProductFromCart,
  } = React.useContext(ProductsContext);

  const quantity = product.quantity;
  return (
    <div className='cart-item'>
      <div className='cart-item__details'>
        <img src={product.produit.image} alt='product' />
        <div>
          <h6>
            {quantity}x {product.produit.nom_produit} {product.taille}{' '}
            {product.promo && product.promo_quantity <= quantity && (
              <p className='badge formule'>F</p>
            )}
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
          onBlur={(e) => {
            const value =
              Number(e.target.innerText) - (product.quantity_already_sold || 0);
            if (Number(e.target.innerText) > 0)
              updateProductQuantity(product, value);
          }}
        >
          {quantity}
        </span>
        <button
          className='btn btn-valider incr'
          onClick={() => handleUpdateProductQuantity(product, 'incr')}
          disabled={
            product.quantite <=
            product.quantity - (product.quantity_already_sold || 0)
          }
        >
          +
        </button>
      </div>
      <button
        className='btn btn-danger w-100 mt-1'
        onClick={() => removeProductFromCart(product)}
      >
        supprimer
      </button>
    </div>
  );
};

const CartFooter = () => {
  const { carts, clearCarts, venteId, initProductsUnvailable } =
    React.useContext(ProductsContext);
  const [sommeEncaisse, setSommeEncaisse] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const total = carts.reduce((acc, produit) => {
    let quantity;
    let promo_quantity = 0;

    if (produit.promo && produit.promo_quantity <= produit.quantity) {
      promo_quantity = parseInt(produit.quantity / produit.promo_quantity);
    }

    if (promo_quantity) {
      quantity = produit.quantity % produit.promo_quantity;
    } else {
      quantity = produit.quantity;
    }

    return (
      acc + produit.prix_vente * quantity + produit.promo_price * promo_quantity
    );
  }, 0);

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

    fetch(venteId ? `/editvente/${venteId}` : '/vente', {
      method: venteId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vente),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.product_unavailables) {
          setLoading(false);
          initProductsUnvailable(data.product_unavailables);
          $('#productUnvailableModal').modal('show');
        } else {
          clearCarts();
          setSommeEncaisse(0);
          setLoading(false);
        }
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
        {loading ? 'En cours...' : venteId ? 'Modifier' : 'Valider'}
      </button>
      {venteId && (
        <button className='btn btn-danger mt-1' onClick={clearCarts}>
          Annuler la modification
        </button>
      )}
    </div>
  );
};
