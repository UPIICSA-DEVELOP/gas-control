export const environment = {
  production: true,
  url: 'https://app.inspectordenormas.com/',
  backendUrl: 'https://inspector-backend.appspot.com',
  develop: false,
  local: false,
  VERSION: require('../../package.json').version,
  firebase: {
    apiKey: "AIzaSyDTrMvI7rKzqvylqMFWitUTO2A2YKdEuWk",
    authDomain: "inspector-maplander.firebaseapp.com",
    databaseURL: "https://inspector-maplander.firebaseio.com",
    projectId: "inspector-maplander",
    storageBucket: "inspector-maplander.appspot.com",
    messagingSenderId: "37596709859"
  }
};
