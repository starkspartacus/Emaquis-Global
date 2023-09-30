const { helperCurrentTime } = require('./helperCurrentTime');

describe('helperCurrentTime', () => {
  it('should return correct date time', () => {
    const timings = [
      {
        _id: '651345476245d8bfde586291',
        day: 1,
        name: 'Lundi',
        start: '16:55',
        end: '23:00',
      },
      {
        _id: '651345476245d8bfde586292',
        day: 2,
        name: 'Mardi',
        start: '08:00',
        end: '08:00',
      },
      {
        _id: '651345476245d8bfde586293',
        day: 3,
        name: 'Mercredi',
        start: '16:00',
        end: '23:00',
      },
      {
        _id: '651345476245d8bfde586294',
        day: 4,
        name: 'Jeudi',
        start: '02:00',
        end: '23:00',
      },
      {
        _id: '651345476245d8bfde586295',
        day: 5,
        name: 'Vendredi',
        start: '00:00',
        end: '23:59',
      },
      {
        _id: '651345476245d8bfde586296',
        day: 6,
        name: 'Samedi',
        start: '09:00',
        end: '00:00',
      },
      {
        _id: '651345476245d8bfde586297',
        day: 0,
        name: 'Dimanche',
        start: '20:11',
        end: '15:00',
      },
    ];

    const { startDate, endDate } = helperCurrentTime({
      date: new Date('2023-09-25T17:00:00.000Z'),
      timings,
    });

    expect(startDate).toEqual(new Date('2023-09-25T16:55:00.000Z'));
    expect(endDate).toEqual(new Date('2023-09-25T23:00:00.000Z'));
  });
});
