const EmDashboardBody = () => {
  return (
    <React.Fragment>
      <div className='row'>
        <EmDashboardVenteTables />
      </div>
      <div className='row'>
        <EmDashboardStocks />
        <EmDashboardEmployes />
      </div>
    </React.Fragment>
  );
};
