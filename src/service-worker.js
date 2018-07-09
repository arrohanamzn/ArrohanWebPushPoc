"use strict";

self.addEventListener("install", function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("push", function(event) {
  console.log("Received a push message", event);

  var payloadData = event.data.json();
  
  // the data we set in pinpoint comes as part of the 'data' key in the payload
  var pinpointPayload = payloadData.data;

  // you probably would want to validate if the fields are present
  // and have additional business logic in payload
  var title = pinpointPayload["pinpoint.notification.title"];
  var body = pinpointPayload["pinpoint.notification.body"];
  var icon = "/images/icon-192x192.png";
  var notificationUrl = pinpointPayload["pinpoint.url"];
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: {
        notificationUrl: notificationUrl // pass the url to open as additional meta data
      }
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  console.log("On notification click: ", event);

  event.notification.close();

  var notificationData = event.notification;
  var notificationUrl = notificationData.data.notificationUrl;

  if (!notificationUrl) {
    console.log("no url to open");
    return;
  }

  // This looks to see if the current page is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === notificationUrl && "focus" in client) {
            client.focus();
            return;
          }
        }
        if (clients.openWindow) {
          clients.openWindow(notificationUrl);
        }
      })
  );
});
