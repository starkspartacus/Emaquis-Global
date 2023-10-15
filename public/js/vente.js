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
  return (
    <div className='row'>
      <MaquisTiming />
      <Billet />
      <AddVente />
    </div>
  );
};

const formatTime = (time) => {
  if (time < 10) {
    return `0${time}`;
  } else {
    return time;
  }
};

const MaquisTiming = () => {
  const [showTiming, setShowTiming] = React.useState(false);
  const [time, setTime] = React.useState(null);

  const { currentTiming } = React.useContext(AppContext);

  // convert time milisecond to minutes

  React.useEffect(() => {
    if (currentTiming && currentTiming.endDate) {
      let timer = setInterval(() => {
        const nowTime = new Date().getTime();
        const endTime = new Date(currentTiming.endDate).getTime();
        //
        const diff = (endTime + 60 * 1000 - nowTime) / 1000;
        const hour = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = Math.floor((diff % 3600) % 60);

        setTime({
          hour,
          minutes,
          seconds,
        });

        if (hour === 0 && minutes <= 30) {
          setShowTiming(true);
        } else {
          setShowTiming(false);
        }

        if (hour === 0 && minutes === 0 && seconds === 0) {
          setShowTiming(false);
          window.location.reload();
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else {
      setShowTiming(false);
      setTime(null);
    }
  }, [currentTiming]);

  return (
    <div>
      {currentTiming && !currentTiming.startDate && !currentTiming.endDate && (
        <h3 className='alert alert-danger text-center'>Le maquis est fermé</h3>
      )}

      {showTiming && !!time && (
        <h3
          className={`alert alert-${
            time.minutes <= 4 ? 'danger' : 'warning'
          } text-center`}
        >
          Attention le maquis ferme dans {formatTime(time.hour)} :{' '}
          {formatTime(time.minutes)} : {formatTime(time.seconds)}
        </h3>
      )}
    </div>
  );
};

const Billet = () => {
  const { billet } = React.useContext(AppContext);

  return (
    <React.Fragment>
      {(!billet || (billet && billet.is_closed)) && (
        <h4
          className={`alert alert-${
            billet && billet.is_closed ? 'danger' : 'warning'
          } text-center`}
        >
          {!billet
            ? 'Veuillez ouvrir la caisse en cliquant sur le button tout en bas svp'
            : 'La caisse est fermée'}
          {!billet && <a href='#openCash'> ici</a>}
        </h4>
      )}
    </React.Fragment>
  );
};
