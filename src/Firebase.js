import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA9e6djQExJZDwqreflPaQwHwr3QIYoS7o",
    authDomain: "facebook-clone-66f62.firebaseapp.com",
    projectId: "facebook-clone-66f62",
    storageBucket: "facebook-clone-66f62.appspot.com",
    messagingSenderId: "167766750737",
    appId: "1:167766750737:web:47f0b9644138d5c28fe3b0",
    measurementId: "G-BXDPXVR244"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };