### GET /notifications

Description:
Returns all notifications for a student.

Response:
[
  {
    "id": 1,
    "type": "Placement",
    "message": "Google hiring drive",
    "isRead": false,
    "createdAt": "2026-06-26T10:00:00Z"
  }
]

Status Code:
200 OK

### GET /notifications/:id

Description:
Returns a specific notification.

Status:
200 OK
404 Not Found

### PATCH /notifications/:id/read

Description:
Marks one notification as read.

Response:

{
   "message":"Notification marked as read"
}

Status:
200 OK

### PATCH /notifications/read-all

Description:
Marks all notifications as read.

Status:
200 OK

### DELETE /notifications/:id

Description:
Deletes notification.

Status:
200 OK
404 Not Found

### GET /notifications?type=Placement

Description:
Returns only placement notifications.

Status:
200 OK