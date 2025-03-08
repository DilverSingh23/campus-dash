import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV3CKuz4AUAjsAG8NCPEq0M_BN1vWGfwM",
  authDomain: "webapp-a1ca3.firebaseapp.com",
  projectId: "webapp-a1ca3",
  storageBucket: "webapp-a1ca3.appspot.com",
  messagingSenderId: "171704310122",
  appId: "1:171704310122:web:745d826833e81720ab6d13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication

// Get the form and submit button
const form = document.getElementById("signup-form");

// Listen for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from reloading the page

  // Get user input values
  const email = document.getElementById("Name-input").value;
  const password = document.getElementById("Password-input").value;

  // Firebase Authentication: Create User
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("User created successfully!");
      window.location.href = "index.html"; // Redirect after signup
    })
    .catch((error) => {
      alert(error.message);
    });
});
