const TablesHead = () => {
  return (
    <thead>
      <tr>
        <th scope="col">Produit</th>
        <th scope="col">Quantité</th>
        <th scope="col">Prix</th>
        <th scope="col">Encaisse</th>
        <th scope="col">Monnaie</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
  );
};

const TablesItem = ({ vente, setShowSuccess, setShowDanger }) => {
  const [loading, setLoading] = React.useState({
    ["Validée"]: false,
    ["Annulée"]: false,
  });

  const { confirmVente } = React.useContext(AppContext);

  const handleSubmit = (venteId, type) => {
    setShowDanger(false);
    setShowSuccess(false);

    setLoading({
      ...loading,
      [type]: true,
    });

    fetch(`/vente/status/${venteId}`, {
      method: "POST",
      body: JSON.stringify({ type }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setShowSuccess(true);
        confirmVente(venteId, type);
        setLoading({
          ...loading,
          [type]: false,
        });

        setTimeout(() => {
          setShowSuccess(false);
        }, 500);
      })
      .catch((err) => {
        console.log(
          "👉 👉 👉  ~ file: em_dashboard_vente_tables.js:54 ~ err",
          err
        );
        setShowDanger(true);
        setLoading({
          ...loading,
          [type]: false,
        });
      });
  };

  return (
    <tr>
      <td>{vente.produit.map((el) => el.produit.nom_produit).join(",")}</td>
      <td>{vente.quantite.join(",")}</td>
      <td>{vente.prix}</td>
      <td>{vente.somme_encaisse}</td>
      <td>{vente.monnaie}</td>
      <td>
        <button
          className="btn btn-info"
          disabled={loading["Validée"] || loading["Annulée"]}
          onClick={() => handleSubmit(vente._id, "Validée")}
        >
          {!loading["Validée"] ? "confirmer" : "en cours..."}
        </button>
        <button
          className="btn btn-danger"
          style={{
            marginLeft: "5px",
          }}
          disabled={loading["Validée"] || loading["Annulée"]}
          onClick={() => handleSubmit(vente._id, "Annulée")}
        >
          {!loading["Annulée"] ? "annuler" : "en cours..."}
        </button>
      </td>
    </tr>
  );
};

const TablesBody = ({ setShowSuccess, setShowDanger }) => {
  const { ventes } = React.useContext(AppContext);

  return (
    <tbody>
      {ventes.map((vente) => {
        return (
          <TablesItem
            key={vente._id}
            vente={vente}
            setShowDanger={setShowDanger}
            setShowSuccess={setShowSuccess}
          />
        );
      })}
    </tbody>
  );
};

const EmDashboardVenteTables = () => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showDanger, setShowDanger] = React.useState(false);

  return (
    <div className="col-xl-8 z-2">
      <div className="white_card mb_30 card_height_100">
        <div className="white_card_header">
          <div className="row align-items-center justify-content-between flex-wrap">
            <div className="col-lg-4">
              <div className="main-title">
                <h3 className="m-0">Commandes en attente</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="table-wrapper-scroll-y my-custom-scrollbar">
          {showSuccess && (
            <div
              className="alert alert-success"
              role="alert"
              // style="text-align: center; display: none"
              style={{
                textAlign: "center",
              }}
              id="alert-success"
            >
              Operation effectuée avec succès !
            </div>
          )}
          {showDanger && (
            <div
              className="alert alert-danger"
              role="alert"
              // style="text-align: center; display: none"
              style={{
                textAlign: "center",
              }}
              id="alert-danger"
            >
              Echec de l'opération, veillez recommencer!
            </div>
          )}
          <table
            className="table table-bordered table-striped mb-9"
            // className="table lms_table_active2 p-0"
            // style={{
            //   width: "98%",
            //   marginLeft: "7px",
            // }}
            // id="ventes_list"
          >
            <TablesHead />
            <TablesBody
              setShowDanger={setShowDanger}
              setShowSuccess={setShowSuccess}
            />
          </table>
        </div>
      </div>
    </div>
  );
};
