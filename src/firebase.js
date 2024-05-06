// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1GgxPwxdH0SL69sIol9VfxJiPlguCjNE",
  authDomain: "react-chat-app-a2d3b.firebaseapp.com",
  databaseURL:
    "https://react-chat-app-a2d3b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "react-chat-app-a2d3b",
  storageBucket: "react-chat-app-a2d3b.appspot.com",
  messagingSenderId: "1070437087740",
  appId: "1:1070437087740:web:4c146e6ef8fb48ff215a79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
