// Variables needed to connect firebase to local project
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCR7eWetjuJOIewzjgIYlvNGh95CFYrWZ8",
    authDomain: "campusdash-4f77d.firebaseapp.com",
    projectId: "campusdash-4f77d",
    storageBucket: "campusdash-4f77d.firebasestorage.app",
    messagingSenderId: "938612318478",
    appId: "1:938612318478:web:2b074652fc377a1122b75f"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

