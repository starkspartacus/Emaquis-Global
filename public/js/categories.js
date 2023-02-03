const Categories = () => {
  const [categories, setCategories] = React.useState([]);
  const { categorySelectedId, handleSelectCategory } =
    React.useContext(ProductsContext);

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
        {categories.map((category) => {
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
