import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyCR7eWetjuJOIewzjgIYlvNGh95CFYrWZ8",
    authDomain: "campusdash-4f77d.firebaseapp.com",
    projectId: "campusdash-4f77d",
    storageBucket: "campusdash-4f77d.firebasestorage.app",
    messagingSenderId: "938612318478",
    appId: "1:938612318478:web:2b074652fc377a1122b75f"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const name = document.getElementById("name-input");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input"); 
const signUpBtn =  document.getElementById("signup-btn"); 

const signUpButtonPressed = async (e) => {
  e.preventDefault(); 
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log(userCredential);
  } catch (error) {
    console.log(error.code);
  }
}
signUpBtn.addEventListener("click",signUpButtonPressed);