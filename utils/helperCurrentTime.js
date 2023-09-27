const { formatTime } = require('./formatTime');
const moment = require('moment');

exports.helperCurrentTime = ({ date = new Date(), timings }) => {
  let startDate = null;
  let endDate = null;

  const currentDay = date.getDay();
  const prevDay = currentDay === 0 ? 6 : currentDay - 1;
  let isPrevDay = false;

  let timing = timings.find((t) => t.day === currentDay);
  const prevTiming = timings.find((t) => t.day === prevDay);
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();

  const currentTime = `${formatTime(currentHour)}:${formatTime(currentMinute)}`;

  let { endTime, endIsLessThanStart } = helperGetTimeEnd(timing);
  const { endTime: prevEndTime } = helperGetTimeEnd(prevTiming);

  if (currentTime < timing.start && currentTime < prevEndTime) {
    timing = { ...prevTiming };
    isPrevDay = true;
    const { endTime: newEndTime, endIsLessThanStart: newEndIsLessThanStart } =
      helperGetTimeEnd(timing);
    endTime = newEndTime;
    endIsLessThanStart = newEndIsLessThanStart;
  }

  if (
    (timing.start <= currentTime && currentTime <= endTime) ||
    (endIsLessThanStart && currentTime <= endTime)
  ) {
    const [startHours, startMinutes] = timing.start.split(':');
    const [endHours, endMinutes] = timing.end.split(':');

    startDate = moment(date.setHours(startHours, startMinutes, 0, 0));
    endDate = moment(date.setHours(endHours, endMinutes, 0, 0));

    if (isPrevDay) {
      startDate = startDate.subtract(1, 'day');
    } else if (endTime >= timing.start && endIsLessThanStart) {
      endDate = endDate.add(1, 'day');
    }
  }

  return {
    startDate: startDate?.toDate() || null,
    endDate: endDate?.toDate() || null,
    currentTime,
  };
};

const helperGetTimeEnd = (timing) => {
  const startTime = timing.start;
  let endTime = timing.end;
  let endIsLessThanStart = false;

  if (endTime <= startTime) {
    const [h, m] = timing.end.split(':');

    endTime = `${Number(h) + 24}:${m}`;
    endIsLessThanStart = true;
  }

  return { endTime, endIsLessThanStart };
};
