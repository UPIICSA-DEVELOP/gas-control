'use-strict';

importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

const config = {
  apiKey: "AIzaSyA_wjUVArtBTuxYIMQb-qJnUvAuJrX1OkQ",
  authDomain: "maplander-public.firebaseapp.com",
  databaseURL: "https://maplander-public.firebaseio.com",
  projectId: "maplander-public",
  storageBucket: "maplander-public.appspot.com",
  messagingSenderId: "131930554368"
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
    icon: data.icon,
    image: data.main_picture,
    data: data
  };
  return self.registration.showNotification(title, options);
});

addEventListener('notificationclick', function(event){
  event.notification.close();
  clients.openWindow(event.notification.data.click_action);
});
