export const environment = {
  production: false,
  url: 'http://localhost:4200/',
  backendUrl:'https://schedule-maplander.appspot.com',
  develop: true,
  local: true,
  VERSION: require('../../package.json').version,
  firebase: {
    apiKey: "AIzaSyAQg07U_ZighMWpsym9Meu7qqqEhf5JP8Q",
    authDomain: "inspector-maplander-develop.firebaseapp.com",
    databaseURL: "https://inspector-maplander-develop.firebaseio.com",
    projectId: "inspector-maplander-develop",
    storageBucket: "inspector-maplander-develop.appspot.com",
    messagingSenderId: "916184923713"
  }
};
