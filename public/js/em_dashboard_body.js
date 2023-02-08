const EmDashboardBody = () => {
  return (
    <React.Fragment>
      <div className="row">
        <EmDashboardVenteTables />
        <EmDashboardEmployes />
      </div>
      <div className="row">
        <EmDashboardStocks />
      </div>
    </React.Fragment>
  );
};
