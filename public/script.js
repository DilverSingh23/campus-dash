// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, serverTimestamp, query, where} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const response = await fetch('/api/server');
const firebaseConfig = await response.json();

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const db = getFirestore(app);

// Global variable to store user role
let map;
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
  const spLocation = document.getElementById("ticketInput-specficLocation");
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
        specficLocation: spLocation.value,
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

// Fetching and Displaying pending tickets for dasher.html
const fetchAndDisplayPendingTickets = async () => {
  try {
    const dMap = document.getElementById('d-map');
    if (dMap) {
      map = L.map('d-map', {
        scrollWheelZoom: false
      }).setView([40.7363, -73.8176], 17); // Queens College coordinates
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    }

    const ticketsRef = collection(db, "tickets");

    // Query Firestore for pending AND in-progress tickets
    const q = query(ticketsRef, where("status", "in", ["Pending", "in-progress"]));
    const querySnapshot = await getDocs(q);

    // Get the ticket display container
    const ticketDisplay = document.getElementById("ticket-display");

    // Convert Firestore snapshot to an array
    let tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Fetched tickets:", tickets);

    // Sort to show in-progress tickets first
    tickets.sort((a, b) => {
      if (a.status === "in-progress" && b.status === "Pending") return -1;
      if (a.status === "Pending" && b.status === "in-progress") return 1;
      return 0;
    });

    // If no tickets, show message
    if (tickets.length === 0) {
      ticketDisplay.innerHTML = "<p>No active orders at the moment.</p>";
      return;
    }

    // Function to display a single ticket
    const displayTicket = (ticket) => {
      // Clear previous content
      ticketDisplay.innerHTML = "";

      let ticketHTML = `
        <div class="ticket-item">
          <p class="ticketOutput"><strong>Customer Name:</strong> ${ticket.name}</p>
          <p class="ticketOutput"><strong>Customer Contact:</strong> ${ticket.contact}</p>
          <p class="ticketOutput"><strong>Delivery Location :</strong> ${ticket.deliveryLocation}</p>
          <p class="ticketOutput"><strong>Room Number :</strong> ${ticket.specficLocation}</p>
          <p class="ticketOutput"><strong>Food Pickup Location:</strong> ${ticket.orderLocation}</p>
          <p class="ticketOutput"><strong>Order Details:</strong> ${ticket.order}</p>
          <p class="ticketOutput"><strong>Payment:</strong> $${ticket.profit}</p>
          <p class="ticketOutput"><strong>Status:</strong> ${ticket.status}</p>
          <div class="button-container">
      `;

      // Show different buttons based on ticket status
      if (ticket.status === "Pending") {
        ticketHTML += `
          <button class="accept-order" data-id="${ticket.id}">Accept Order</button>
          <button class="decline-order" data-id="${ticket.id}">Decline Order</button>
        `;
      } else if (ticket.status === "in-progress") {
        ticketHTML += `
          <button class="complete-order" data-id="${ticket.id}">Order Complete</button>
        `;
      }

      ticketHTML += `</div></div>`;
      ticketDisplay.innerHTML = ticketHTML;

      // Attach event listeners after the buttons are created
      if (ticket.status === "Pending") {
        document.querySelector(".accept-order").addEventListener("click", async (event) => {
          const ticketId = event.target.getAttribute("data-id");
          await handleAccept(ticketId);
        });

        document.querySelector(".decline-order").addEventListener("click", async (event) => {
          const ticketId = event.target.getAttribute("data-id");
          console.log("Order Declined:", ticketId);
          // Find next ticket
          const currentIndex = tickets.findIndex(t => t.id === ticketId);
          tickets.splice(currentIndex, 1); // Remove declined ticket
          
          if (tickets.length > 0) {
            displayTicket(tickets[0]); // Show next ticket
          } else {
            ticketDisplay.innerHTML = "<p>No more pending orders.</p>";
          }
        });
      } else if (ticket.status === "in-progress") {
        document.querySelector(".complete-order").addEventListener("click", async (event) => {
          const ticketId = event.target.getAttribute("data-id");
          await handleComplete(ticketId);
        });
      }
    };

    const locationMap = new Map([
      ["Alumni Hall", [40.736759197800446, -73.81776297729851]],
      ["Campbell Dome", [40.736200638300275, -73.81836545105936]],
      ["Colden Auditorium", [40.7382650976061, -73.8159351546978]],
      ["Colwin Hall", [40.73498891913439, -73.8174995895732]],
      ["Delany Hall", [40.734908538882834, -73.81688276967381]],
      ["Dining Hall", [40.737053504872534, -73.81745882942138]],
      ["FitzGerald Gym", [40.73782084892258, -73.81959422148282]],
      ["Frese Hall", [40.735701243017004, -73.81729760815095]],
      ["Goldstein Theatre", [40.73782070576673, -73.81526905488785]],
      ["Honors Hall", [40.734448976779476, -73.8185331270404]],
      ["Jefferson Hall", [40.73519418629525, -73.8161509751362]],
      ["Kiely Hall", [40.73598670643268, -73.81595348050523]],
      ["King Hall", [40.73698666611463, -73.81530492145079]],
      ["Klapper Hall", [40.73625173606999, -73.81724925162135]],
      ["Music Building", [40.737966132533366, -73.81699714486197]],
      ["Powdermaker Hall", [40.73600261747065, -73.81905762660504]],
      ["Rathaus Hall", [40.73742615613944, -73.81651991872204]],
      ["Remsen Hall", [40.734858070410645, -73.81886578566898]],
      ["Rosenthal Library", [40.73638881670385, -73.82004380236624]],
      ["Science Building", [40.73496605886057, -73.82035135056574]],
      ["Student Union", [40.73431896959577, -73.81629983799486]],
      ["The Summit", [40.73713750465218, -73.81934991162076]],
      ["Science Building Cafe", [40.73527085920169, -73.8202619365584]],
      ["QC Campus Eats", [40.73724379113104, -73.81711906215641]],
      ["Mama's Kitchen", [40.73724379113104, -73.81711906215641]],
      ["Taiwanese Yummy", [40.73724379113104, -73.81711906215641]],
      ["Reem’s Grill House", [40.73724379113104, -73.81711906215641]],
      ["Tealicious", [40.73724379113104, -73.81711906215641]],
      ["Halal Food Truck", [40.73559073723301, -73.81691408373005]],
      ["Mr. Sandwich Food Truck", [40.73559073723301, -73.81691408373005]],
      ["Empanada Food Truck", [40.73559073723301, -73.81691408373005]],
      ["Waffe & Dingles Food Cart", [40.7355761091673, -73.81935154509246]]
  ]);

    // Function to handle accepting an order
    const handleAccept = async (ticketId) => {
      try {
        console.log(`Attempting to accept order: ${ticketId}`);
        const ticketRef = doc(db, "tickets", ticketId);

        // Update Firestore document status to "in-progress"
        await updateDoc(ticketRef, {
          status: "in-progress",
          acceptedAt: new Date()
        });

        console.log(`Order ${ticketId} updated to 'in-progress'`);

        // Update the local ticket status
        const updatedTicket = tickets.find(t => t.id === ticketId);
        if (updatedTicket) {
          updatedTicket.status = "in-progress";
          // Re-display the updated ticket
          displayTicket(updatedTicket);
          showMarkers(updatedTicket);
        }

      } catch (error) {
        console.error("Error accepting order:", error);
        alert("Failed to accept the order. Please try again.");
      }
    };

    const showMarkers = (ticket) => {
      if (!map) return; // Safety check
      
      const orderCoords = locationMap.get(ticket.orderLocation);
      const deliveryCoords = locationMap.get(ticket.deliveryLocation);
      
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      
      if (orderCoords) {
        const orderMarker = L.marker(orderCoords).addTo(map);
        orderMarker.bindPopup(`Pickup: ${ticket.orderLocation}`)
      }
      
      if (deliveryCoords) {
        const deliveryMarker = L.marker(deliveryCoords).addTo(map);
        deliveryMarker.bindPopup(`Delivery: ${ticket.deliveryLocation}`)
      }
      
      if (orderCoords && deliveryCoords) {
        const bounds = L.latLngBounds([orderCoords, deliveryCoords]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          layer.openPopup();
        }
       });
    }

    // Function to handle completing an order
    const handleComplete = async (ticketId) => {
      try {
        console.log(`Completing order: ${ticketId}`);
        const ticketRef = doc(db, "tickets", ticketId);

        // Update Firestore document status to "completed"
        await updateDoc(ticketRef, {
          status: "completed",
          completedAt: new Date()
        });

        console.log(`Order ${ticketId} marked as 'completed'`);
        resetMap();


        // Remove completed ticket from local array
        tickets = tickets.filter(t => t.id !== ticketId);
        
        // Show next ticket or completion message
        if (tickets.length > 0) {
          displayTicket(tickets[0]);
        } else {
          ticketDisplay.innerHTML = "<p>All orders completed! 🎉</p>";
        }

      } catch (error) {
        console.error("Error completing order:", error);
        alert("Failed to complete the order. Please try again.");
      }
    };
    // Function to reset the map to its initial state
    const resetMap = () => {
      if (!map) return;
      
      // Remove all markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    // Reset view to Queens College coordinates with default zoom
      map.setView([40.7363, -73.8176], 17);
    }

    // Display the first ticket
    displayTicket(tickets[0]);

  } catch (error) {
    console.error("Error fetching tickets:", error);
    document.getElementById("ticket-display").innerHTML = "<p>Error loading orders.</p>";
  }
};

// Call function when page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayPendingTickets);
