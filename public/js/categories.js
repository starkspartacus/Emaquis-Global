const Categories = () => {
  const [categories, setCategories] = React.useState([]);
  const { categorySelectedId, handleSelectCategory } =
    React.useContext(ProductsContext);

  const { products: allProducts, user } = React.useContext(AppContext);

  React.useEffect(() => {
    const cats = globalCategories;
    if (cats.length > 0) {
      handleSelectCategory(cats[0]._id);
      setCategories(cats);
    }
  }, []);

  return (
    <div className='categories'>
      <h4>Categories</h4>
      <ul>
        {user && user.product_return_type === 'tip' && (
          <li
            className={categorySelectedId === 'tip' ? 'active' : ''}
            onClick={() => handleSelectCategory('tip')}
          >
            Avoirs
          </li>
        )}

        {!!allProducts.some((prod) => prod.promo) && (
          <li
            className={categorySelectedId === 'formule' ? 'active' : ''}
            onClick={() => handleSelectCategory('formule')}
          >
            Formules
          </li>
        )}

        {categories.map((category) => {
          if (
            allProducts.filter(
              (prod) => prod.produit.categorie._id === category._id
            ).length === 0
          )
            return null;

          return (
            <li
              key={category._id}
              className={categorySelectedId === category._id ? 'active' : ''}
              onClick={() => handleSelectCategory(category._id)}
            >
              {category.nom}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
