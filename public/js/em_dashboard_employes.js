const formatAmount = (montant) => {
  const tab = ("" + (montant > 0 ? montant : ("" + montant).slice(1)))
    .split("")
    .reverse();
  let d = 3;
  for (let i = 0; i < tab.length; i++) {
    if (d + 1 > tab.length) {
      break;
    }
    if (tab.length >= 11) {
      tab.splice(d === 3 ? d : d + i, 0, ".");
    } else {
      tab.splice(d === 3 ? d : d + 1, 0, ".");
    }

    d += 3;
  }
  tab.reverse();
  while (tab[0] === ".") {
    tab.splice(0, 1);
  }
  return (
    (isNaN(montant) || "" + montant === "0"
      ? "0"
      : (montant >= 0 ? "" : "-") + tab.join("")) + " FCFA"
  );
};

const EmDashboardEmployes = () => {
  const { totalEmployes, totalVentes } = React.useContext(AppContext);

  return (
    <div className="col-xl-2 mt-2">
      <div className="white_card card_height_100 mb_30 user_crm_wrapper">
        <div className="row">
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
          <div className="col-lg-12">
            <div className="single_crm">
              <div className="crm_head crm_bg_1 d-flex align-items-center justify-content-between">
                <div className="thumb">
                  <img
                    src="../img/icone_ventes.png"
                    // style="height: 17px; transform: rotate(-20deg)"
                    style={{
                      height: "17px",
                      transform: "rotate(-20deg)",
                    }}
                    alt=""
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                    className="text-center"
                  >
                    Ventes
                  </span>
                </div>
                <i className="fas fa-ellipsis-h f_s_11 white_text"></i>
              </div>
              <div className="crm_body">
                <h4>
                  <span>{formatAmount(totalVentes)}</span>
                </h4>
                <p>Aujourd'hui</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
