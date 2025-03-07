// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Firebase configuration
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
const rtdb = getDatabase(app);


document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([40.7363, -73.8176], 17);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        minZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    const halalMarker = L.marker(40.7360, 73.8160).addTo(map);
    halalMarker.bindPopup("Halal Food Truck").openPopup();
    

    setTimeout(function() {
        map.invalidateSize();
    }, 300);
});
