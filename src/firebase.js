import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBb5kkyd6yElh7ZUihcaSw2LrOjIZQUmiY",

  authDomain: "chat-3801f.firebaseapp.com",

  projectId: "chat-3801f",

  storageBucket: "chat-3801f.appspot.com",

  messagingSenderId: "442028196827",

  appId: "1:442028196827:web:01e104847145bc32909dfe"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
