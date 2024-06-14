// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRBKhIFryLrOlrAV953Gr-N3ct77LlbBg",
  authDomain: "mdf-geohave.firebaseapp.com",
  projectId: "mdf-geohave",
  storageBucket: "mdf-geohave.appspot.com",
  messagingSenderId: "277572171229",
  appId: "1:277572171229:web:69e273a762358d6fa53234"
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{
  db
}