import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/analytics';


var firebaseConfig = {
    apiKey: "AIzaSyDavi8UAAyA8dy8Cr171DfIkcKwvqDfstI",
    authDomain: "chat-app-react-8bfe9.firebaseapp.com",
    databaseURL: "https://chat-app-react-8bfe9.firebaseio.com",
    projectId: "chat-app-react-8bfe9",
    storageBucket: "chat-app-react-8bfe9.appspot.com",
    messagingSenderId: "861365395028",
    appId: "1:861365395028:web:0300c8030928ee211397c1",
    measurementId: "G-JYBM6X5FX0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

export default firebase;