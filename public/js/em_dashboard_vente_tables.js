const TablesHead = () => {
  return (
    <thead>
      <tr>
        <th scope='col'>Produit</th>
        <th scope='col'>Quantité</th>
        <th scope='col'>Prix</th>
        <th scope='col'>Encaisse</th>
        <th scope='col'>Monnaie</th>
        <th scope='col'>Table</th>
        <th scope='col'>Date</th>
        <th scope='col'>Employé</th>
        <th scope='col'>Action</th>
      </tr>
    </thead>
  );
};

const TablesItem = ({
  vente,
  setShowSuccess,
  setShowDanger,
  setVenteIdToDelete,
  setVenteToConfirm,
  venteToConfirm,
}) => {
  const [loading, setLoading] = React.useState({
    ['Validée']: false,
    ['Annulée']: false,
  });

  const { confirmVente } = React.useContext(AppContext);
  const { initCarts, venteId } = React.useContext(ProductsContext);

  const handleSubmit = (venteId, type) => {
    if (type === 'edit') {
      initCarts(vente);
      return;
    } else if (type === 'Annulée') {
      $('#deleteVenteModal').modal('show');

      setVenteIdToDelete(venteId);
      return;
    } else if (!vente.amount_collected) {
      $('#collectedAmount').modal('show');

      setVenteToConfirm(vente);
      return;
    }

    setShowDanger(false);
    setShowSuccess(false);

    setLoading({
      ...loading,
      [type]: true,
    });

    fetch(`/vente/status/${venteId}`, {
      method: 'POST',
      body: JSON.stringify({ type }),
      headers: {
        'Content-Type': 'application/json',
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
          setVenteToConfirm(vente);
          $('#confirmOrder').modal('show');
        }, 500);
      })
      .catch((err) => {
        setShowDanger(true);
        setLoading({
          ...loading,
          [type]: false,
        });
      });
  };

  const produits = vente.produit.map((el, i) => {
    const text = i === vente.produit.length - 1 ? '' : ' , ';
    if (
      vente.formules &&
      vente.formules.find(
        (formule) =>
          formule.taille === el.taille &&
          formule.produit_name === el.produit.nom_produit
      )
    ) {
      return (
        <span className='product-formule' key={el._id}>
          {el.produit.nom_produit}
          {text}
        </span>
      );
    } else {
      return (
        <span key={el._id}>
          {el.produit.nom_produit}
          {text}
        </span>
      );
    }
  });

  return (
    <tr
      className={`vente_table_item${
        vente._id === venteId ||
        (venteToConfirm && vente._id === venteToConfirm._id)
          ? ' active'
          : ''
      }`}
    >
      <td>{produits}</td>
      <td>{vente.quantite.join(',')}</td>
      <td>{vente.prix}</td>
      <td>{vente.somme_encaisse}</td>
      <td>{vente.monnaie}</td>
      <td>{vente.table_number}</td>
      <td>
        {new Date(vente.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })}
      </td>
      <td>{vente.employe.prenoms || vente.employe.prenom}</td>

      <td className='btn-actions'>
        <button
          disabled={loading['Validée'] || loading['Annulée']}
          onClick={() => handleSubmit(vente._id, 'Validée')}
        >
          <img src='/svgs/okcircle.svg' alt='valid' />
        </button>
        <button
          style={{
            display: 'inline-block',
            margin: '0 5px',
          }}
          onClick={() => handleSubmit(vente._id, 'edit')}
        >
          <img src='/svgs/modifier.svg' alt='edit' />
        </button>

        {vente.amount_collected && (
          <button
            disabled={loading['Validée'] || loading['Annulée']}
            onClick={() => handleSubmit(vente._id, 'Annulée')}
          >
            <img src='/svgs/trash-b.svg' alt='cancel' />
          </button>
        )}
      </td>
    </tr>
  );
};

const ModalDelete = ({
  venteIdToDelete,
  onClose,
  setShowSuccess,
  setShowDanger,
}) => {
  const [loading, setLoading] = React.useState(false);

  const { confirmVente } = React.useContext(AppContext);

  const handleClose = () => {
    onClose();
    $('#deleteVenteModal').modal('hide');
  };

  const handleUpdateVente = () => {
    setLoading(true);
    fetch(`/vente/status/${venteIdToDelete}`, {
      method: 'POST',
      body: JSON.stringify({ type: 'Annulée' }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setShowSuccess(true);
        confirmVente(venteIdToDelete, 'Annulée');
        setLoading(false);

        setTimeout(() => {
          handleClose();
          setShowSuccess(false);
        }, 500);
      })
      .catch((err) => {
        setShowDanger(true);
        setLoading(false);
      });
  };

  return (
    <div
      className='modal fade'
      id='deleteVenteModal'
      tabindex='-1'
      role='dialog'
      aria-labelledby='myModalTitle'
      data-backdrop='false'
    >
      <div
        className='modal-dialog modal-dialog-centered'
        style={{
          maxWidth: '600px',
        }}
        role='document'
      >
        {!!venteIdToDelete && (
          <div className='modal-content'>
            <div className='modal-header'>
              <h2 className='modal-title' id='exampleModalLongTitle'>
                Suppression d'une vente
              </h2>
              <button
                type='button'
                className='close close-modal'
                data-dismiss='modal'
                aria-label='Close'
                id='close-modal'
                onClick={handleClose}
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <h4> êtes vous sûr de vouloir supprimer la vente ?</h4>
            </div>

            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger close-modal'
                onClick={handleUpdateVente}
                disabled={loading}
              >
                {loading ? 'Annulation..' : 'Oui'}
              </button>
              <button
                type='button'
                className='btn btn-success close-modal'
                data-dismiss='modal'
                onClick={handleClose}
              >
                Non
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalConfirmOrder = ({ venteIdToConfirm, onClose }) => {
  const handleClose = () => {
    onClose();
    $('#confirmOrder').modal('hide');
  };

  return (
    <div
      className='modal fade'
      id='confirmOrder'
      tabindex='-1'
      role='dialog'
      aria-labelledby='myModalTitle'
      data-backdrop='false'
    >
      <div
        className='modal-dialog modal-dialog-centered'
        style={{
          maxWidth: '600px',
        }}
        role='document'
      >
        {!!venteIdToConfirm && (
          <div className='modal-content'>
            <div className='modal-header'>
              <h2 className='modal-title' id='exampleModalLongTitle'>
                Commande confirmée avec succès
              </h2>
              <button
                type='button'
                className='close close-modal'
                data-dismiss='modal'
                aria-label='Close'
                id='close-modal'
                onClick={handleClose}
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <h4 className='text-center'>Voulez-vous imprimer le ticket</h4>
            </div>

            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger close-modal'
                onClick={handleClose}
              >
                Non
              </button>
              <a
                type='button'
                className='btn btn-success close-modal'
                data-dismiss='modal'
                onClick={handleClose}
                href={`/generate-ticket/${
                  venteIdToConfirm._id || venteIdToConfirm
                }`}
                target='_blank'
              >
                Oui
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalCollectedAmount = ({ vente, onClose }) => {
  const [loading, setLoading] = React.useState(false);

  const { confirmVente } = React.useContext(AppContext);

  const [sommeEncaisse, setSommeEncaisse] = React.useState(null);

  const handleClose = () => {
    onClose();
    $('#collectedAmount').modal('hide');

    $('#confirmOrder').modal('show');

    setSommeEncaisse(null);
  };

  const handleUpdateVente = () => {
    if (sommeEncaisse < vente.prix) {
      alert('La somme encaissée doit être supérieure au prix de la vente');
      return;
    }

    const data = {
      produit: vente.produit.map((prod) => prod.productId),
      quantite: vente.quantite,
      somme_encaisse: Number(sommeEncaisse),
      amount_collected: true,
      table_number: vente.table_number,
      update_for_collected_amount: true,
    };

    setLoading(true);
    fetch(`/editvente/${vente._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.etat) {
          setLoading(false);
          confirmVente(vente._id, 'Validée');
          handleClose();
        } else {
          alert('Une erreur est survenue');
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
    <div
      className='modal fade'
      id='collectedAmount'
      tabindex='-1'
      role='dialog'
      aria-labelledby='myModalTitle'
      data-backdrop='false'
    >
      <div
        className='modal-dialog modal-dialog-centered'
        style={{
          maxWidth: '600px',
        }}
        role='document'
      >
        {!!vente && (
          <div className='modal-content'>
            <div className='modal-header'>
              <h3 className='modal-title' id='exampleModalLongTitle'>
                Confirmation de la vente table N°{vente.table_number}
              </h3>
              <button
                type='button'
                className='close close-modal'
                data-dismiss='modal'
                aria-label='Close'
                id='close-modal'
                onClick={handleClose}
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <h4>
                Prix: <b>{vente.prix} FCFA</b>
              </h4>
              <input
                type='number'
                placeholder='Somme encaissé'
                className='form-control mb-1'
                value={sommeEncaisse}
                onChange={(e) => setSommeEncaisse(e.target.value)}
              />
              <p>
                Monnaie à rendre:{' '}
                <b>
                  {vente.prix < sommeEncaisse ? sommeEncaisse - vente.prix : 0}{' '}
                  FCFA
                </b>
              </p>
            </div>

            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-success close-modal'
                onClick={handleUpdateVente}
                disabled={loading}
              >
                {loading ? 'En cours..' : 'Valider'}
              </button>
              <button
                type='button'
                className='btn btn-danger close-modal'
                data-dismiss='modal'
                onClick={handleClose}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TablesBody = ({
  setShowSuccess,
  setShowDanger,
  setVenteIdToDelete,
  setVenteToConfirm,
  venteToConfirm,
}) => {
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
            setVenteIdToDelete={setVenteIdToDelete}
            setVenteToConfirm={setVenteToConfirm}
            venteToConfirm={venteToConfirm}
          />
        );
      })}
    </tbody>
  );
};

const EmDashboardVenteTables = () => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showDanger, setShowDanger] = React.useState(false);
  const [venteIdToDelete, setVenteIdToDelete] = React.useState(null);
  const [venteToConfirm, setVenteToConfirm] = React.useState(null);
  const { venteId } = React.useContext(ProductsContext);

  return (
    <React.Fragment>
      <div className={`col-xl-12 z-2 mt-${venteId ? '5' : '2'}`}>
        <div className='white_card mb_30 card_height_100'>
          <div className='white_card_header'>
            <div className='row align-items-center justify-content-between flex-wrap'>
              <div className='col-lg-4'>
                <div className='main-title'>
                  <h3 className='m-0'>Commandes en attente</h3>
                </div>
              </div>
            </div>
          </div>
          <div className='table-wrapper-scroll-y my-custom-scrollbar'>
            {showSuccess && (
              <div
                className='alert alert-success'
                role='alert'
                // style="text-align: center; display: none"
                style={{
                  textAlign: 'center',
                }}
                id='alert-success'
              >
                Operation effectuée avec succès !
              </div>
            )}
            {showDanger && (
              <div
                className='alert alert-danger'
                role='alert'
                // style="text-align: center; display: none"
                style={{
                  textAlign: 'center',
                }}
                id='alert-danger'
              >
                Echec de l'opération, veillez recommencer!
              </div>
            )}
            <table
              className='table table-bordered table-striped mb-9'
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
                setVenteIdToDelete={setVenteIdToDelete}
                setVenteToConfirm={setVenteToConfirm}
                venteToConfirm={venteToConfirm}
              />
            </table>
          </div>
        </div>
      </div>
      <ModalDelete
        onClose={() => setVenteIdToDelete(null)}
        venteIdToDelete={venteIdToDelete}
        setShowDanger={setShowDanger}
        setShowSuccess={setShowSuccess}
      />
      <ModalCollectedAmount vente={venteToConfirm} onClose={() => {}} />
      <ModalConfirmOrder
        venteIdToConfirm={venteToConfirm}
        onClose={() => setVenteToConfirm(null)}
      />
    </React.Fragment>
  );
};
