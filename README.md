## Push Messaging and Notification Sample
===

### Why Web Push
Web push is awesome ! 
Engagement, native app feature on the web, Progressive Web App, industry reports etc

### Why Pinpoint
Web push is cool, and FCM already abstracts the complexities of sending web push (like adding VAPID headers and payload encryption) . So why do I need Pinpoint ?
- *Map FCM tokens to actual users and web app 'installs'*: FCM would give you tokens for each user on your website who subscribes for web push. Roughly speaking, an fcm token for each web app install with permissions to send push messages. To be able to send messages to these users we would need to store the FCM tokens for each user/web app install/browser instance. Pinpoint treats each browser instance as an endpoint and enables you to save the push tokens in the same way in which we would store native push tokens/mobile numbers/email addresses, i.e. as a primary identifier for that endpoint. This enables us to send messages to Pinpoint endpoints without caring about the underlying complexity of storing and managing push tokens.
- *Intelligently send web push, map user attributes to push tokens*: Along with the push token, each pinpoint endpoint can also store a [bunch of other attributes](https://docs.aws.amazon.com/pinpoint/latest/apireference/rest-api-endpoint.html#rest-api-endpoint-schemas) like device characteristics, user Id and user attributes. This helps us to create dynamic and complex [segments](https://docs.aws.amazon.com/pinpoint/latest/userguide/segments.html) which can be used to send targeted web push notifications.
- *It is essentially the same as sending android native push*: Create an FCM project, Fetch FCM tokens, Create pinpoint endpoints with the tokens, send push campaigns to those endpoints. Swap out native android code with service workers and javascript on the client and you get web push. It really is that simple.
- *Web push, native push, SMS or emails. One stop shop for reaching out to users on all channels*: Pinpoint becomes your single backend for reaching out to users across [multiple channels](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels.html). For app users, send them app push, for users who prefer the web, you have web push.
- *Leverage Pinpoint features like Campaign Management, Events, Analytics and Segments*: Read up about [pinpoint](https://aws.amazon.com/pinpoint/). It has a bunch of cool features !

### Gist of what we are trying to do
Enable web push by using FCM as an intermediary service and Pinpoint as an app server (map fcm tokens to actual users) and a push campaign management tool.
Integrate web push protocol, FCM and aws Pinpoint.

### Prerequisites
- FCM developer account and an aws account
- Create a FCM project on the [Firebase Developer Console](https://console.firebase.google.com). You need to have fcm developer account to access the console.	
- [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Amplify cli setup](https://aws-amplify.github.io/docs/) (Create a aws account if you don't already have one)
	
### Recommended
- Web Push fundamentals, some basic reading up on web push notifications and going through a couple of relevant code samples. It is not compulsory to implement and understand everything (or anything at all :D ), but it would be beneficial to have an elementary understanding of service workers, permissions, push subscriptions and notifications apis.
	- [Introduction](https://developers.google.com/web/fundamentals/push-notifications/): Some of the sections are a bit detailed and complex, you need not go through all the sections completely at once. However, at least go through the [overview](https://developers.google.com/web/fundamentals/push-notifications/) and the [how push works](https://developers.google.com/web/fundamentals/push-notifications/how-push-works) sections carefully.
	- Simple [Code demo](https://developers.google.com/web/fundamentals/codelabs/push-notifications/) with explanations to help you get started.
- [FCM client side code](https://firebase.google.com/docs/cloud-messaging/js/client): You need not go through the send Message sections since we will not directly use fcm apis or the console but instead use pinpoint console to manage our push campaigns.		
- [Building web apps with amplify](https://aws-amplify.github.io/docs/js/start): By the end of the tutorial you should get clarity on how to build and host web apps using aws amplify. Will also help you become familiar with the amplify cli tool.
- Read up on [pinpoint](https://docs.aws.amazon.com/pinpoint)

### Steps
- git clone git@github.com:arrohanamzn/ArrohanWebPushPoc.git
- On the FCM push project:
	- Go to Project Settings, click the 'Cloud Messaging Tab'. Click generate key pair under web push certificates to generate a [vapid public-private key pair](https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol#application_server_keys). 
	- Replace the `<YOUR PUBLIC KEY`> in main.js with the vapid public key you generated in the previous step.
	- Replace `<Your Cloud Sender ID ...>` in main.js with your own sender ID from the Firebase Developer Console for that project.
	- Note the Legacy Server key, you will need it during pinpoint project setup
- Setup a [amplify web app](https://aws-amplify.github.io/docs/js/start) and integrate with pinpoint: 
	- Install dependencies: cd to root directory of our app. Run `npm install`
	- Create a pinpoint project and integrate with our web app through amplify cli:
		- Setup amplify: cd to root directory of our app. Run `amplify init`, accept all defaults
		- Create a pinpoint project: Run `amplify add analytics`, accept all defaults
		- Push to aws: Run `amplify push`. A configuration file (aws-exports.js) will be added to the source directory. Notice, we are calling this file from our [main.js](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/src/main.js#L153-L15) file.
- Pinpoint Project setup:
	- Open the pinpoint project you created in the previous step on the [aws console](https://console.aws.amazon.com/pinpoint/home/).
	- [Add FCM Legacy server key](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-mobile-manage.html) to the Project. The process is exactly the same one would follow for [native android apps](https://aws-amplify.github.io/docs/android/push-notifications-setup-fcm)	
- Send a test message: 
	- Run `npm start`, our web app will be running on `http://localhost:8080/index.html`.
	- click on enable push messages and click allow/accept on the browser permission prompt which follows.
	- open [developer console](https://developers.google.com/web/tools/chrome-devtools/console/#open_as_panel) on your browser. You will see some logs being written to the console, copy the "fcm token" (refresh page if you don't see any logs).
	- Go to your pinpoint project on the [aws console](https://console.aws.amazon.com/pinpoint/home/), click on your project and then go to test messaging. The process is exactly the same as described [here](https://console.aws.amazon.com/pinpoint/home/#/apps). Under "destination type" select "Device Tokens" and paste the fcm token you copied in the previous step.
	- Fill in title, body and optionally url ("Go to a url" under "Actions"). Click on Send Message, you should get a push message on your browser.
- [Host your app](https://aws-amplify.github.io/docs/js/start#step-5-host-your-app)
- Create segments and [campaings](https://docs.aws.amazon.com/pinpoint/latest/userguide/campaigns.html) on pinpoint.

### Code walkthrough
- github link: https://github.com/arrohanamzn/ArrohanWebPushPoc
- Filewise description:
	- [package.json](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/package.json): Simple [npm config](https://docs.npmjs.com/files/package.json) file. It includes the list of dependencies and their versions used by our web app. For our use case, all we need is webpack and aws amplify
	- [package-lock.json](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/package-lock.json): Auto generated [config file](https://docs.npmjs.com/files/package-lock.json) generated by npm after resolving modules and package.json.
	- aws-exports.js: Auto generated configuration file created by amplify cli. This file contains the configuration and endpoint metadata used to link your front end to your backend services. It will be structured similar to the [sample config file](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/aws-exports-sample.js).
	- [webpack.config.js](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/webpack.config.js): Simple [webpack configuration](https://webpack.js.org/configuration) file
	- src: The folder which contains the source code for our web app. It contains:
		- [service-worker.js](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/src/service-worker.js): The service worker that we register for our website which is used to display push notifications. In the service worker we parse the notification payload sent through pinpoint and call the notification apis to display push notification with the appropriate fields.
		webpack.config.js file.
		- [index.html](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/src/index.html): The website html.
		- [main.js](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/src/main.js): The heart of the web app. It does permission handling, push subscription management and communicates with FCM and AWS.
  -[images/icon-192x192.png](https://github.com/arrohanamzn/ArrohanWebPushPoc/blob/PinpointBlog/images/icon-192x192.png): static icon that we display on our push messages. This would essentially be your website logo.

### Future work
- Develop understanding and expertise on web push:
	- Read the full [push notifications tutorial](https://developers.google.com/web/fundamentals/push-notifications/)
	- The [web push book](https://web-push-book.gauntface.com/) by the same author
	- [The push api spec](https://www.w3.org/TR/push-api/): You don't need it now but a useful resource later on
	- Push api [mozilla doc](https://developer.mozilla.org/en-US/docs/Web/API/Push_API): overview, spec, browser compatibility and other useful info.
	- [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/): The technical foundation which makes "native app like" features like push possible on the web.
- Richer and smarter push notifications. Add big images, action buttons, replace notifications using tags (for example score updates) and explore other features in the [show notifications api](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification)
- Smart push notifications: add custom business logic in the payload. Hint: use the "body" ("pinpoint.notification.body") field on the pinpoint console to send a custom json string 
- Driving more subscriptions: [Track](https://aws-amplify.github.io/docs/js/analytics#page-event-tracking) how users interact with the push subscribe button. Think of [where and how](https://developers.google.com/web/fundamentals/push-notifications/permission-ux) you might ask users to subscribe to drive maximum engagement
- Easy unsubscribe: Allow users an easy option to disable push notifications without having to block you from browser settings. Also, make sure that you are disabling that endpoint on pinpoint. Hint: use the updateEndpoint api and pass optOut from 'ALL' as the argument.
- Targeted and relevant push notifications: Use the concepts of segments to send users push notifications according to their interests and requirements. Hint: add user data to endpoints and use it to filter and create targeted segments
- Campaign management: Leverage pinpoint features like segments, analytics, campaigns and more !
