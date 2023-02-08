const TablesStocksHead = () => {
  return (
    <thead>
      <tr>
        <th scope="col">Produit</th>
        <th scope="col">Nom du produit</th>
        <th scope="col">Taile</th>
        <th scope="col">Prix de vente</th>
        <th scope="col">Quantité</th>
      </tr>
    </thead>
  );
};

const TablesStocksBody = () => {
  const { products } = React.useContext(AppContext);

  return (
    <tbody>
      {products.map((product) => {
        return (
          <tr key={product._id}>
            <td>
              <div className="customer d-flex align-items-center">
                <div className="thumb_34 mr_15 mt-0">
                  <img
                    src={product.produit.image}
                    alt="image produit"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span className="f_s_12 f_w_600 color_text_5">
                  {product.nom_produit}
                </span>
              </div>
            </td>
            <td className="f_s_12 f_w_400 color_text_6">
              {product.produit.nom_produit}
            </td>
            <td className="f_s_12 f_w_400 color_text_6">{product.taille}</td>
            <td className="f_s_12 f_w_400 color_text_6">
              {product.prix_vente} FCFA
            </td>
            <td className="f_s_12 f_w_400 text-center">
              <a
                href="#"
                className=""
                style={{
                  color:
                    product.quantite >= 100
                      ? "rgb(47, 204, 47)"
                      : "rgb(219, 36, 23)",
                }}
              >
                {product.quantite}
              </a>
            </td>
          </tr>
        );
      })}

      {/* <% produits.map((el)=>{ %>

  <tr>
    <td>
      <div className="customer d-flex align-items-center">
        <div className="thumb_34 mr_15 mt-0">
          <img
            src="<%= el.produit.image %>"
            alt="image produit"
            style="
              width: 40px;
              height: 40px;
              object-fit: contain;
            "
          />
        </div>
        <span className="f_s_12 f_w_600 color_text_5">
          <%= el.nom_produit %></span
        >
      </div>
    </td>
    <td className="f_s_12 f_w_400 color_text_6">
      <%= el.produit.nom_produit %>
    </td>
    <td className="f_s_12 f_w_400 color_text_6">
      <%= el.taille %>
    </td>
    <td className="f_s_12 f_w_400 color_text_6">
      <%= el.prix_vente %> FcFA
    </td>
    <td className="f_s_12 f_w_400 text-center">
      <% if(el.quantite <= 100){ %>
      <a
        href="#"
        className=""
        style="color: rgb(219, 36, 23)"
      >
        <%= el.quantite %></a
      >

      <% } else{ %>
      <a
        href="#"
        className=""
        style="color: rgb(47, 204, 47)"
      >
        <%= el.quantite %></a
      >

      <% } %>
    </td>
  </tr>
  <% }) %> */}
    </tbody>
  );
};

const EmDashboardStocks = () => {
  const { products } = React.useContext(AppContext);

  return (
    <div className="col-lg-12">
      <div className="white_card card_height_100 mb_20">
        <div className="white_card_header">
          <div className="box_header m-0">
            <div className="main-title">
              <h3 className="m-0">Inventaire du stock</h3>
            </div>
          </div>
        </div>
        <div className="white_card_body QA_section table-wrapper-scroll-y my-custom-scrollbar">
          <div className="QA_table">
            <table className="table lms_table_active2 p-0">
              <TablesStocksHead />
              <TablesStocksBody />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
