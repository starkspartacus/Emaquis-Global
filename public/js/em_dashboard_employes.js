const formatAmount = (montant) => {
  const tab = ('' + (montant > 0 ? montant : ('' + montant).slice(1)))
    .split('')
    .reverse();
  let d = 3;
  for (let i = 0; i < tab.length; i++) {
    if (d + 1 > tab.length) {
      break;
    }
    if (tab.length >= 11) {
      tab.splice(d === 3 ? d : d + i, 0, '.');
    } else {
      tab.splice(d === 3 ? d : d + 1, 0, '.');
    }

    d += 3;
  }
  tab.reverse();
  while (tab[0] === '.') {
    tab.splice(0, 1);
  }
  return (
    (isNaN(montant) || '' + montant === '0'
      ? '0'
      : (montant >= 0 ? '' : '-') + tab.join('')) + ' FCFA'
  );
};

const EmDashboardEmployes = () => {
  const { totalVentes, billet, user, updateBillet, resetTotalVentes } =
    React.useContext(AppContext);

  const { venteId } = React.useContext(ProductsContext);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [productsReturn, setProductsReturn] = React.useState([]);

  const handleToggleOpenDay = () => {
    // open billet
    setLoading(true);
    fetch(
      `/billet/${billet && !billet.is_closed ? 'closeBillet' : 'openBillet'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employe_id: user._id,
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          if (!data.data.is_closed) {
            resetTotalVentes();
          }

          if (data.productsReturn && data.productsReturn.length > 0) {
            setProductsReturn(data.productsReturn);
            $('#modalMessageProductsReturn').modal('show');
          }

          updateBillet(data.data);
        } else if (data.message) {
          setMessage(data.message);
          $('#modalMessage').modal('show');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleCloseMessage = () => {
    $('#modalMessage').modal('hide');
    setMessage(null);
  };

  const handleCloseProductReturnModal = () => {
    $('#modalMessageProductsReturn').modal('hide');
    setProductsReturn([]);
    window.location.reload();
  };

  const closeBilletText =
    billet && !billet.is_closed
      ? loading
        ? 'Fermeture en cours...'
        : 'Fermer la caisse'
      : loading
      ? 'Ouverture en cours...'
      : 'Ouvrir la caisse';

  return (
    <div className={`col-xl-3 mt-${venteId ? '5' : '2'}`}>
      <div className='white_card card_height_100 mb_30 user_crm_wrapper'>
        <div className='row'>
          {/* <div className="col-lg-6">
            <div className="single_crm">
              <div className="crm_head d-flex align-items-center justify-content-between">
                <div className="thumb">
                  <img
                    src="../img/icone_employee.png"
                    alt=""
                    // style="height: 29px"
                    style={{
                      height: "29px",
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Employés
                  </span>
                </div>
                <i className="fas fa-ellipsis-h f_s_11 white_text"></i>
              </div>
              <div className="crm_body">
                <h4 className="text-center">{totalEmployes}</h4>
              </div>
            </div>
          </div> */}
          <div className='col-lg-12'>
            <div className='single_crm'>
              <div className='crm_head crm_bg_1 d-flex align-items-center justify-content-between'>
                <div className='thumb'>
                  <img
                    src='../img/icone_ventes.png'
                    // style="height: 17px; transform: rotate(-20deg)"
                    style={{
                      height: '17px',
                      transform: 'rotate(-20deg)',
                    }}
                    alt=''
                  />
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                    className='text-center'
                  >
                    Ventes
                  </span>
                </div>
                <i className='fas fa-ellipsis-h f_s_11 white_text'></i>
              </div>
              <div className='crm_body'>
                <h4>
                  <span>{formatAmount(totalVentes)}</span>
                </h4>
                <p>
                  {billet && billet.is_closed
                    ? 'Montant après fermeture'
                    : "Aujourd'hui"}
                </p>
                <button
                  id='openCash'
                  onClick={handleToggleOpenDay}
                  className={`btn btn-${
                    billet && !billet.is_closed ? 'danger' : 'success'
                  } w-100 mt-2`}
                  disabled={loading}
                >
                  {closeBilletText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className='modal fade'
        id='modalMessage'
        tabindex='-1'
        role='dialog'
        aria-labelledby='modalMessageTitle'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                IMPOSSIBLE DE FERMER LA CAISSE
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>{message}</div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-success'
                data-dismiss='modal'
                onClick={handleCloseMessage}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className='modal fade'
        id='modalMessageProductsReturn'
        tabindex='-1'
        role='dialog'
        aria-labelledby='modalMessageProductsReturnTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered'
          role='document'
          style={{
            maxWidth: '50%',
          }}
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                INFORMATIONS
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              {productsReturn &&
                productsReturn.map((productReturn) => {
                  return (
                    <p>
                      la quantité du {productReturn.produit.nom_produit}{' '}
                      {productReturn.taille} est passée de{' '}
                      {productReturn.oldQuantite} à {productReturn.quantite}{' '}
                      suite à l'expiration du code {productReturn.code}
                    </p>
                  );
                })}
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-success'
                data-dismiss='modal'
                onClick={handleCloseProductReturnModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
