const { getTopNotifications } = require("./priorityInbox");

const notifications = [
    {
        ID: "1",
        Type: "Placement",
        Message: "Google Hiring",
        Timestamp: "2026-04-22T17:51:30"
    },
    {
        ID: "2",
        Type: "Event",
        Message: "Hackathon",
        Timestamp: "2026-04-22T17:52:30"
    },
    {
        ID: "3",
        Type: "Result",
        Message: "Semester Result",
        Timestamp: "2026-04-22T17:53:30"
    }
];

console.log(getTopNotifications(notifications));