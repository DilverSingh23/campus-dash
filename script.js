// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Global variable to store user role
let role = "";

// Function to update UI based on authentication state
function updateUI(user) {
  const navButtons = document.getElementById("nav-buttons");
  const signOutButton = document.getElementById("sign-out");
  const ctaMainBtn = document.getElementById("cravings-cta");
  const ctaMainBtn2 = document.getElementById("dasher-cta");
  
  if (user) {
    // User is signed in
    if (navButtons) navButtons.style.display = "none";
    if (signOutButton) signOutButton.style.display = "flex";
    
    // Check if CTA buttons exist before modifying them
    if (ctaMainBtn && ctaMainBtn2) {
      ctaMainBtn.style.display = "none";
      ctaMainBtn2.style.display = "none";
      
      if (role === "customer") {
        ctaMainBtn.style.display = "flex";
      } else if (role === "dasher") {
        ctaMainBtn2.style.display = "flex";
      }
    }
  } else {
    // User is signed out
    if (navButtons) navButtons.style.display = "flex";
    if (signOutButton) signOutButton.style.display = "none";
    
    // Check if CTA buttons exist before modifying them
    if (ctaMainBtn && ctaMainBtn2) {
      ctaMainBtn.style.display = "flex";
      ctaMainBtn2.style.display = "flex";
    }
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

// Set up role selection buttons
const customerBtn = document.getElementById("customer-btn");
const dasherBtn = document.getElementById("dasher-btn");

if (customerBtn) {
  customerBtn.addEventListener("click", function() {
    role = "customer";
    console.log("Role selected:", role);
  });
}

if (dasherBtn) {
  dasherBtn.addEventListener("click", function() {
    role = "dasher";
    console.log("Role selected:", role);
  });
}

// Handle sign up (only on signup page)
const signUpEmail = document.getElementById("email-input");
const signUpPassword = document.getElementById("password-input");
const signUpBtn = document.getElementById("signup-btn");

if (signUpBtn && signUpEmail && signUpPassword) {
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (!role) {
      alert("Please select a role (Customer or Dasher)");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value);
      
      // Store user role in Firestore
      try {
        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          email: signUpEmail.value,
          role: role,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error storing user role:", error);
      }
      
      window.location.href = "index.html";
    } catch(error) {
      console.error("Signup error:", error.code, error.message);
      alert("Signup failed: " + error.message);
    }
  });
}

// Handle login (only on login page)
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");

if (loginBtn && loginEmail && loginPassword) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      window.location.href = "index.html";
    } catch(error) {
      console.error("Login error:", error.message);
      alert("Invalid email or password. Please try again.");
    }
  });
}

// Handle order form submission
const orderForm = document.getElementById("dash-order-form");

if (orderForm) {
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevents page from being refreshed 

    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to submit an order");
      return;
    }

    // Get all the input fields
    const customerContact = document.getElementById("ticketInput-customerContact");
    const customerName = document.getElementById("ticketInput-customerName");
    const deliveryLocation = document.getElementById("ticketInput-delieveryLocation");
    const order = document.getElementById("ticketInput-order");
    const orderLocation = document.getElementById("ticketInput-orderLocation");
    const profit = document.getElementById("ticketInput-profit");

    // Check if all fields exist and have values
    if (!customerContact || !customerName || !deliveryLocation || !order || !orderLocation || !profit) {
      alert("Please fill all required fields");
      return;
    }

    // JSON object that takes data from the form and passes it to Firestore database
    const orderData = {
      customerContact: customerContact.value,
      customerName: customerName.value,
      deliveryLocation: deliveryLocation.value,
      order: order.value,
      orderLocation: orderLocation.value,
      profit: profit.value,
      status: "Pending",
      timestamp: serverTimestamp()
    };

    try {
      // Add document to the tickets collection
      await addDoc(collection(db, "tickets","tickets-input"), orderData);
      alert("Order placed successfully!");
      orderForm.reset(); // Clear form fields after submission
    } catch (error) {
      console.error("Error adding order: ", error);
      alert("Failed to place order. Error: " + error.message);
    }
  });
}

