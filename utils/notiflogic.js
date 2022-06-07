const {eventQueries} = require("../requests/calendarQueries");
exports.getNotification = async ()=>{
    const Events = await eventQueries.getEvent();
    const events = Events.result;
    nbEvent = events.length

    return nbEvent;
}