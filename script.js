// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");

console.log("Login form initialization", { 
  formExists: !!loginForm, 
  buttonExists: !!loginBtn 
});

const handleLogin = async (event) => {
  console.log("Login form submitted");
  event.preventDefault(); 
  const loginEmail = document.getElementById("login-email").value;
  const loginPassword = document.getElementById("login-password").value;
  const email = loginEmail.trim();
  const password = loginPassword.trim(); 
  
  console.log("Form values", { 
    emailElement: document.getElementById("login-email"),
    passwordElement: document.getElementById("login-password"),
    email: email, 
    password: password ? "[REDACTED]" : "" 
  });
  
  if(!email || !password){
    console.log("Validation failed: Empty email or password");
    showAlert("Please enter both email and password.");
    return;
  }
  
  try {
    console.log("Attempting Firebase sign in with email:", email);
    
    // Check if auth and other Firebase objects exist
    console.log("Firebase objects", { 
      authExists: !!auth, 
      dbExists: !!db,
      signInFunctionExists: typeof signInWithEmailAndPassword === 'function'
    });
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful", { uid: userCredential.user.uid });
    const user = userCredential.user;
    window.location.href = "index.html";
  }
  catch(error) {
    console.error("Login error:", error);
    console.log("Error details", { 
      code: error.code, 
      message: error.message 
    });
    
    let errorMessage = "Login failed. Please try again.";

    if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed login attempts. Please try again later.";
    }
    
    console.log("Showing alert:", errorMessage);
    showAlert(errorMessage);
  }
};

// Check if showAlert function exists
console.log("showAlert function exists:", typeof showAlert === 'function');

if (loginForm) {
  console.log("Adding event listener to login form");
  loginForm.addEventListener("submit", handleLogin);
} else {
  console.error("Login form element not found in the document");
  // Try to find why the form might not be found
  console.log("All forms in document:", document.querySelectorAll("form"));
  console.log("Element with ID 'login-form':", document.getElementById("login-form"));
}

// Log when the script has finished executing
console.log("Login script loaded and configured");
  

   

// if (loginEmail && loginPassword ) {
//   loginBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
//       if(db.signUpEmai && db.signUpPassword === loginEmail && loginBtn)
//         window.location.href = "index.html";
//     } catch(error) {
//       console.error("Login error:", error.message);
//       alert("Invalid email or password. Please try again.");
//     }
//   });
//  }
 
// Handle order form submission (only if the form exists)
const orderForm = document.getElementById("dash-order-form");

if (orderForm) {
  // Get form input elements
  const customerContact = document.getElementById("ticketInput-customerContact");
  const customerName = document.getElementById("ticketInput-customerName");
  const deliveryLocation = document.getElementById("ticketInput-deliveryLocation");
  const order = document.getElementById("ticketInput-order");
  const orderLocation = document.getElementById("ticketInput-orderLocation");
  const profit = document.getElementById("ticketInput-profit");
  const status = "Pending";

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      // Use the imported addDoc function with collection reference
      await addDoc(collection(db, "tickets"), {
        name: customerName.value,
        contact: customerContact.value,
        orderLocation: orderLocation.value,
        order: order.value,
        deliveryLocation: deliveryLocation.value,
        profit: profit.value,
        createdAt: serverTimestamp()
      });
      
      console.log("Order submitted successfully");
      orderForm.reset();
      alert("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order: " + error.message);
    }
  });
}