// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, query, where} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

 const getUserRole = async (uid) => {
  try {
    // Fetch all users from Firestore
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    // Find the user with matching UID
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      if (userData.uid === uid) {
        console.log("Found user role:", userData.role);
        return userData.role;
      }
    }
    
    console.log("No user found with UID:", uid);
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

// Function to update UI based on authentication state
async function updateUI(user) {
  const topButtons = document.getElementById("top-buttons");
  const signUpButton = document.getElementById("sign-up");
  const signOutBtn = document.getElementById("sign-out");
  const logInButton = document.getElementById("log-in");
  const ctaMainBtn = document.getElementById("cravings-cta");
  const ctaMainBtn2 = document.getElementById("dasher-cta");
  const enter = document.getElementById("enter");
  
  if (user) {
    // User is signed in
    if (logInButton) logInButton.style.display = "none";
    if (signUpButton) signUpButton.style.display = "none";
    if (signOutBtn) signOutBtn.style.display = "flex";
    if (topButtons) topButtons.style.display = "none";
    
    // Get user role and update UI accordingly
    const userRole = await getUserRole(user.uid);
    
    if (enter) {
      enter.style.display = "flex";
      enter.addEventListener("click", () => {
        if (userRole === "customer") {
          window.location.href = "customer.html";
        } else {
          window.location.href = "dasher.html";
        }
      });
    }
    
    // // Check if CTA buttons exist before modifying them
    if (ctaMainBtn && ctaMainBtn2) {
      // Initially hide both buttons
      ctaMainBtn.style.display = "none";
      ctaMainBtn2.style.display = "none";
      
      // Show the appropriate button based on role
      if (userRole === "customer") {
        ctaMainBtn.style.display = "flex";
      } else if (userRole === "dasher") {
        ctaMainBtn2.style.display = "flex";
      }
    }
  } else {
    // User is signed out
    if (logInButton) logInButton.style.display = "flex";
    if (signUpButton) signUpButton.style.display = "flex";
    if (signOutBtn) signOutBtn.style.display = "none";
    if (enter) enter.style.display = "none";
    if (topButtons) topButtons.style.display = "flex";
    
    // Check if CTA buttons exist before modifying them
    if (ctaMainBtn && ctaMainBtn2) {
      ctaMainBtn.style.display = "flex";
      ctaMainBtn2.style.display = "flex";
    }
  }
}



// Then update your onAuthStateChanged function
onAuthStateChanged(auth, async (user) => {
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

const handleLogin = async (event) => {
  event.preventDefault(); 
  const loginEmail = document.getElementById("login-email").value;
  const loginPassword = document.getElementById("login-password").value;
  const email = loginEmail.trim();
  const password = loginPassword.trim(); 
  
  if(!email || !password){
    alert("Please enter both email and password.");
    return;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    window.location.href = "index.html";
  }
  catch(error) {
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
    
    alert(errorMessage);
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
 
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
        status: status,
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

// Function to fetch and display pending tickets
const fetchAndDisplayPendingTickets = async () => {
  try {
      const ticketsRef = collection(db, "tickets");

      const q = query(ticketsRef, where("status", "==", "Pending"));
      const querySnapshot = await getDocs(q);

      const ticketDisplay = document.getElementById("ticket-display");

      let pendingTickets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
      }));

      if (pendingTickets.length === 0) {
          ticketDisplay.innerHTML = "<p>No active orders at the moment.</p>";
          return;
      }

      let currentTicketIndex = 0;

      // Function to display the current ticket
      const displayCurrentTicket = () => {
          ticketDisplay.innerHTML = "";

          if (currentTicketIndex >= pendingTickets.length) {
              ticketDisplay.innerHTML = "<p>No more pending orders to review.</p>";
              return;
          }

          const ticket = pendingTickets[currentTicketIndex];

          // Create ticket container
          const ticketDiv = document.createElement("div");
          ticketDiv.classList.add("ticket-item");

          // Populate ticket details
          ticketDiv.innerHTML = `
              <p class="ticketOutput"><strong>Customer Name:</strong> ${ticket.name}</p>
              <p class="ticketOutput"><strong>Customer Contact:</strong> ${ticket.contact}</p>
              <p class="ticketOutput"><strong>Delivery Location on Campus:</strong> ${ticket.deliveryLocation}</p>
              <p class="ticketOutput"><strong>Food Pickup Location:</strong> ${ticket.orderLocation}</p>
              <p class="ticketOutput"><strong>Order Details:</strong> ${ticket.order}</p>
              <p class="ticketOutput"><strong>Payment:</strong> $${ticket.profit}</p>
              <div class="button-container">
                  <button class="accept-order">Accept Order</button>
                  <button class="decline-order">Decline Order</button>
              </div>
          `;

          // Append to display container
          ticketDisplay.appendChild(ticketDiv);

          // Add event listeners to buttons
          ticketDisplay.querySelector(".accept-order").addEventListener("click", () => handleAccept(ticket.id));
          ticketDisplay.querySelector(".decline-order").addEventListener("click", () => handleDecline());
      };

      // Function to handle accepting an order
      const handleAccept = async (ticketId) => {
          try {
              // Update the status in Firestore
              const ticketRef = doc(db, "tickets", ticketId);
              await updateDoc(ticketRef, {
                  status: "accepted",
                  acceptedAt: new Date()
              });

              console.log("Order accepted:", ticketId);

              // Remove accepted ticket from the array and re-render
              pendingTickets = pendingTickets.filter(ticket => ticket.id !== ticketId);
              displayCurrentTicket();
          } catch (error) {
              console.error("Error accepting order:", error);
              alert("Failed to accept the order. Please try again.");
          }
      };

      // Function to handle declining an order (removes from the list)
      const handleDecline = () => {
          console.log("Order declined/skipped");
          
          // Remove declined ticket from array and re-render
          pendingTickets.splice(currentTicketIndex, 1);
          displayCurrentTicket();
      };

      // Display the first ticket
      displayCurrentTicket();

  } catch (error) {
      console.error("Error fetching pending tickets:", error);
      document.getElementById("ticket-display").innerHTML = "<p>Error loading orders.</p>";
  }
};

// Call function when page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayPendingTickets);