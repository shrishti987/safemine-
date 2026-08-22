import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAc2C2qEXujPTLwy1O7QYNBY6XZHrXqMAw",
  authDomain: "safemine-smart-helmet.firebaseapp.com",
  databaseURL: "https://safemine-smart-helmet-default-rtdb.firebaseio.com",
  projectId: "safemine-smart-helmet",
  storageBucket: "safemine-smart-helmet.firebasestorage.app",
  messagingSenderId: "188214160498",
  appId: "1:188214160498:web:ffea2fbd04bc2e366e66eb",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);