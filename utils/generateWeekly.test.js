describe('generateWeekly', () => {
  it('should return 6 weeks in month 6', () => {
    const { getWeeksInMonth } = require('./generateWeekly');
    const weeksInMonth = getWeeksInMonth(6, 2023);
    expect(weeksInMonth).toBe(6);
  });

  it('should return correct date by weekend, month and year', () => {
    const { getDateByWeekendMonthYear } = require('./generateWeekly');
    const { start, end } = getDateByWeekendMonthYear(6, 7, 2023);
    expect(start).toEqual(new Date('2023-07-31T00:00:00.000Z'));
    expect(end).toEqual(new Date('2023-08-06T23:59:59.999Z'));
  });

  it('should return 6 weeks in month 7', () => {
    const { getWeeksInMonth } = require('./generateWeekly');
    const weeksInMonth = getWeeksInMonth(7, 2023);
    expect(weeksInMonth).toBe(5);
  });

  it('should return correct date by weekend, month and year in month 8 weekly 1', () => {
    const { getDateByWeekendMonthYear } = require('./generateWeekly');
    const { start, end } = getDateByWeekendMonthYear(1, 8, 2023);
    expect(start).toEqual(new Date('2023-07-31T00:00:00.000Z'));
    expect(end).toEqual(new Date('2023-08-06T23:59:59.999Z'));
  });

  it('should return correct date by weekend, month and year in month 8 weekly 2', () => {
    const { getDateByWeekendMonthYear } = require('./generateWeekly');
    const { start, end } = getDateByWeekendMonthYear(2, 8, 2023);
    expect(start).toEqual(new Date('2023-08-07T00:00:00.000Z'));
    expect(end).toEqual(new Date('2023-08-13T23:59:59.999Z'));
  });

  it('should return correct date by weekend, month and year in month 8 weekly 3', () => {
    const { getDateByWeekendMonthYear } = require('./generateWeekly');
    const { start, end } = getDateByWeekendMonthYear(3, 8, 2023);
    expect(start).toEqual(new Date('2023-08-14T00:00:00.000Z'));
    expect(end).toEqual(new Date('2023-08-20T23:59:59.999Z'));
  });

  it('should return correct date by weekend, month and year in month 8 weekly 4', () => {
    const { getDateByWeekendMonthYear } = require('./generateWeekly');
    const { start, end } = getDateByWeekendMonthYear(4, 8, 2023);
    expect(start).toEqual(new Date('2023-08-21T00:00:00.000Z'));
    expect(end).toEqual(new Date('2023-08-27T23:59:59.999Z'));
  });

  it('should return correct date by weekend, month and year in month 8 weekly 5', () => {
    const { getDateByWeekendMonthYear } = require('./generateWeekly');
    const { start, end } = getDateByWeekendMonthYear(5, 8, 2023);
    expect(start).toEqual(new Date('2023-08-28T00:00:00.000Z'));
    expect(end).toEqual(new Date('2023-09-03T23:59:59.999Z'));
  });
});
