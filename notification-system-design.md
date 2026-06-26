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

# Stage 2

## Database Choice

I recommend MongoDB because:

- Flexible schema
- High read/write performance
- Easy scalability
- Easy integration with Node.js using Mongoose

## Collections

### students

```json
{
  "_id": ObjectId,
  "name": "Vaibhav Tripathi",
  "email": "csai23088@glbitm.ac.in"
}
```

### notifications

```json
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "type": "Placement",
  "message": "Google Hiring Drive",
  "isRead": false,
  "createdAt": ISODate()
}
```

## MongoDB Queries

### Insert Notification

```javascript
db.notifications.insertOne({
  studentId: ObjectId("student_id"),
  type: "Placement",
  message: "Google Hiring Drive",
  isRead: false,
  createdAt: new Date()
});
```

### Get Unread Notifications

```javascript
db.notifications.find({
  studentId: ObjectId("student_id"),
  isRead: false
});
```

### Mark Notification as Read

```javascript
db.notifications.updateOne(
  { _id: ObjectId("notification_id") },
  {
    $set: {
      isRead: true
    }
  }
);
```

### Delete Notification

```javascript
db.notifications.deleteOne({
  _id: ObjectId("notification_id")
});
```

### Get Placement Notifications

```javascript
db.notifications.find({
  type: "Placement"
});
```

## Indexes

```javascript
db.notifications.createIndex({ studentId: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ createdAt: -1 });
```

# Stage 3

## Why is the given query slow?

The query becomes slow because the notifications table contains around 5 million records. Without proper indexing, the database performs a full table scan before filtering the results. Sorting by createdAt also increases execution time.

## Optimized Query

```sql
SELECT *
FROM notifications
WHERE studentId = 1042
  AND isRead = false
  AND notificationType = 'Placement'
  AND createdAt >= NOW() - INTERVAL 7 DAY
ORDER BY createdAt DESC;
```

## Recommended Index

```sql
CREATE INDEX idx_notifications
ON notifications(studentId, isRead, notificationType, createdAt DESC);
```

## Why not index every column?

Creating indexes on every column is not a good practice because:

- It increases storage usage.
- Inserts and updates become slower.
- Database has to maintain every index.
- Composite indexes perform much better for this query.

# Stage 4
## Solution

To reduce database load, I recommend using **Redis Cache**.

### Flow

1. User opens notification page.
2. Application first checks Redis Cache.
3. If notifications exist in cache, return them directly.
4. If cache miss occurs, fetch notifications from MongoDB.
5. Store the result in Redis with a short expiration time (for example, 5 minutes).
6. Return the notifications to the user.

## Advantages

- Faster response time.
- Reduced database load.
- Better scalability.
- Handles high traffic efficiently.

## Trade-offs

- Additional infrastructure is required.
- Cache may contain slightly stale data until it expires.
- Cache invalidation needs to be handled carefully.

# Stage 5
## Problems with Current Implementation

The current implementation sends email, saves to database, and pushes notifications one by one for every student.

Problems:

- Very slow for 50,000 users.
- If email sending fails, the process stops.
- Database writes become a bottleneck.
- High server load.
- No retry mechanism.
- Poor scalability.

## Improved Architecture

Use an asynchronous message queue such as RabbitMQ, Kafka, or AWS SQS.

Flow:

1. HR clicks "Notify All".
2. API validates the request.
3. Notification jobs are pushed into the message queue.
4. Worker services process jobs in parallel.
5. One worker sends emails.
6. Another worker saves notifications to MongoDB.
7. Another worker sends push notifications.
8. Failed jobs are retried automatically.

## Improved Architecture

Use an asynchronous message queue such as RabbitMQ, Kafka, or AWS SQS.

Flow:

1. HR clicks "Notify All".
2. API validates the request.
3. Notification jobs are pushed into the message queue.
4. Worker services process jobs in parallel.
5. One worker sends emails.
6. Another worker saves notifications to MongoDB.
7. Another worker sends push notifications.
8. Failed jobs are retried automatically.

## Improved Pseudocode

```javascript
function notifyAll(studentIds, message) {

    for (const studentId of studentIds) {

        queue.publish({
            studentId,
            message
        });

    }

    return "Notification request accepted";
}
```

## Worker

```javascript
queue.consume((job) => {

    saveToDatabase(job);

    sendEmail(job);

    sendPushNotification(job);

});
```

## Benefits

- Faster execution
- Parallel processing
- Automatic retries
- Fault tolerant
- Highly scalable
- Better user experience




