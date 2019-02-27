'use-strict';

importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

console.log('is dev');

const config = {
  apiKey: "AIzaSyAQg07U_ZighMWpsym9Meu7qqqEhf5JP8Q",
  authDomain: "inspector-maplander-develop.firebaseapp.com",
  databaseURL: "https://inspector-maplander-develop.firebaseio.com",
  projectId: "inspector-maplander-develop",
  storageBucket: "inspector-maplander-develop.appspot.com",
  messagingSenderId: "916184923713"
};
firebase.initializeApp(config);


const messaging = firebase.messaging();

addEventListener('install', function(event){
  console.debug('Service worker installed');
});

addEventListener('activate', function(event) {
  console.debug('Service Worker activating.');
});

messaging.setBackgroundMessageHandler(function (payload)  {
  const data = payload.data;
  const title = data.title;
  const options = {
    body: data.body,
    icon: 'favicon.png'
  };
  return self.registration.showNotification(title, options);
});

addEventListener('notificationclick', function(event){
  event.notification.close();
  clients.openWindow(event.notification.data.click_action);
});
