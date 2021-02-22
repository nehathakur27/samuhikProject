import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBywaZeAyeKpK2SHVdWwHHIkC1eVMLX8-s",
    authDomain: "samuhik-9e450.firebaseapp.com",
    projectId: "samuhik-9e450",
    storageBucket: "samuhik-9e450.appspot.com",
    messagingSenderId: "966668649082",
    appId: "1:966668649082:web:be99b3601ae9622c0431c3"
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();