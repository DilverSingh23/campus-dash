// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCR7eWetjuJOIewzjgIYlvNGh95CFYrWZ8",
  authDomain: "campusdash-4f77d.firebaseapp.com",
  projectId: "campusdash-4f77d",
  storageBucket: "campusdash-4f77d.firebasestorage.app",
  messagingSenderId: "938612318478",
  appId: "1:938612318478:web:2b074652fc377a1122b75f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);


// Function to update UI based on authentication state
function updateUI(user) {
  const navButtons = document.getElementById("nav-buttons");
  const signOutButton = document.getElementById("sign-out");
  const ctaMainBtn = document.getElementById("cravings-cta");
  const ctaMainBtn2 = document.getElementById("dasher-cta");
  
  if (user) {
    // User is signed in
    if (navButtons) navButtons.style.display = "none";
    if (signOutButton.style.display == "none") signOutButton.style.display = "flex";
    if (ctaMainBtn) ctaMainBtn.style.display = "none";
    if (ctaMainBtn2) ctaMainBtn2.style.display = "none";
    if (role == "customer") {
      ctaMainBtn.style.display = "flex";
    }
    else {
      ctaMainBtn2.style.display = "flex";
    }

  } else {
    // User is signed out
    if (navButtons) navButtons.style.display = "flex";
    if (signOutButton.style.display == "flex") signOutButton.style.display = "none";
    if (ctaMainBtn.style.display == "none"|| ctaMainBtn2.style.display == "none") ctaMainBtn.style.display = "flex"; ctaMainBtn2.style.display = "flex";
  }
}

// Check for auth state changes
onAuthStateChanged(auth, (user) => {
  updateUI(user);
});

// Handle sign out
const signOutBtn = document.getElementById("sign-out");
if (signOutBtn) {
  signOutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      // UI will be updated by the onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });
}

// Handle sign up (only on signup page)
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const signUpBtn = document.getElementById("signup-btn");

// Only set up role buttons if they exist on the page
const customerBtn = document.getElementById("customer-btn");
const dasherBtn = document.getElementById("dasher-btn");

let role = "";
if (customerBtn) {
  customerBtn.addEventListener("click", function() {
    role = "customer";
    console.log(role);
  });
}

if (dasherBtn) {
  dasherBtn.addEventListener("click", function() {
    role = "dasher";
    console.log(role);
  });
}

// Only set up sign up button if it exists on the page
if (signUpBtn && email && password) {
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      window.location.href = "index.html";
    } catch(error) {
      console.log(error.code);
    }
  });
}