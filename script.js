// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCV3CKuz4AUAjsAG8NCPEq0M_BN1vWGfwM",
  authDomain: "webapp-a1ca3.firebaseapp.com",
  projectId: "webapp-a1ca3",
  storageBucket: "webapp-a1ca3.firebasestorage.app",
  messagingSenderId: "171704310122",
  appId: "1:171704310122:web:745d826833e81720ab6d13"
};

const email= document.getElementById('Name-input').value;
const password= document.getElementById('Password-input').value;
const submit= document.getElementById('submit-button').value;
submit.addEventListener("click", function (event) {

event.preventDefault()
})

