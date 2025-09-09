// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDr_hvEnXO9yNY8S1oz8HK7Apwnm2nCThA",
  authDomain: "menu-4e02a.firebaseapp.com",
  databaseURL: "https://menu-4e02a-default-rtdb.firebaseio.com",
  projectId: "menu-4e02a",
  storageBucket: "menu-4e02a.firebasestorage.app",
  messagingSenderId: "687645540811",
  appId: "1:687645540811:web:3fdce650eda2cb8e73b64e",
  measurementId: "G-BV41SQ98TX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
