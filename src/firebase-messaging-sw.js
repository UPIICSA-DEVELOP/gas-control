'use-strict';

importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

const config = {
  apiKey: "AIzaSyDq9HzuM0DMge7-LOrclM_OhmnhnrsCwLM",
  authDomain: "schedule-maplander.firebaseapp.com",
  databaseURL: "https://schedule-maplander.firebaseio.com",
  projectId: "schedule-maplander",
  storageBucket: "schedule-maplander.appspot.com",
  messagingSenderId: "948220319278"
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
