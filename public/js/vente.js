const AddVente = () => {
  return (
    <div className='vente'>
      <Categories />
      <ProductList />
      <CartList />
    </div>
  );
};

const VenteRoot = () => {
  return (
    <div className='row'>
      <AddVente />
    </div>
  );
};
