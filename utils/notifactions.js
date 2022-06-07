const {eventQueries} = require("../requests/calendarQueries")

exports.takeNotificationAction = (socket,event)=>{
    socket.on(event, async(data) => {
        const Delete = await eventQueries.deleteEvent(data);
        if (Delete.result !== null) {
            socket.emit("deleted")
        }
    })
}