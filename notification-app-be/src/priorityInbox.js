function getPriority(type) {
    switch (type) {
        case "Placement":
            return 30;

        case "Result":
            return 20;

        case "Event":
            return 10;

        default:
            return 0;
    }
}

function getTopNotifications(notifications) {

    return notifications
        .map(notification => ({
            ...notification,
            priority: getPriority(notification.Type)
        }))
        .sort((a, b) => {

            if (b.priority !== a.priority) {
                return b.priority - a.priority;
            }

            return new Date(b.Timestamp) - new Date(a.Timestamp);

        })
        .slice(0, 10);

}

module.exports = {
    getTopNotifications
};