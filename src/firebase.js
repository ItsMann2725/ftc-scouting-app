// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIw8mlLXQyOvgUGip2_qewqLecFg4PVRI",
  authDomain: "ftc-scouting-app-7c0da.firebaseapp.com",
  projectId: "ftc-scouting-app-7c0da",
  storageBucket: "ftc-scouting-app-7c0da.firebasestorage.app",
  messagingSenderId: "147725671765",
  appId: "1:147725671765:web:2cbce0714b1cae5b3f23dc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
