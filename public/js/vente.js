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
  const { billet } = React.useContext(AppContext);
  return (
    <div className='row'>
      {(!billet || (billet && billet.is_closed)) && (
        <h4
          className={`alert alert-${
            billet && billet.is_closed ? 'danger' : 'warning'
          } text-center`}
        >
          {!billet
            ? 'Veuillez ouvrir la caisse en cliquant sur le button tout en bas svp'
            : 'La caisse est fermée'}
        </h4>
      )}
      <AddVente />
    </div>
  );
};
