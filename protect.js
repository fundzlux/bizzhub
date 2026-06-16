import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

console.log("Protect.js loading...");

let isChecking = true;

onAuthStateChanged(auth, (user) => {
  isChecking = false;
  
  if (!user) {
    console.log("No user authenticated, redirecting to login");
    // Only redirect to login if we're not already on login/signup pages
    if (!window.location.pathname.includes("login") && !window.location.pathname.includes("signup")) {
      window.location.replace("login.html");
    }
  } else {
    console.log("User authenticated:", user.email);
  }
});

// Prevent page load until auth check is complete (max 5 seconds)
let checkAttempts = 0;
const checkInterval = setInterval(() => {
  checkAttempts++;
  if (isChecking === false || checkAttempts > 50) {
    clearInterval(checkInterval);
  }
}, 100);