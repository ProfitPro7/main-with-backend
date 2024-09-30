import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCIR1Qz6yylSS2ZsLreOJDE806It372ItI",
  authDomain: "profitpro-e81ab.firebaseapp.com",
  databaseURL: "https://profitpro-e81ab-default-rtdb.firebaseio.com",
  projectId: "profitpro-e81ab",
  storageBucket: "profitpro-e81ab.appspot.com",
  messagingSenderId: "399320183593",
  appId: "1:399320183593:web:99474f8d34ad23a59d3d38",
  measurementId: "G-XW9MTC7Z2J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth};

