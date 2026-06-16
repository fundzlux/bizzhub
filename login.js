import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

function showError(message) {
  const errorDiv = document.getElementById("errorMsg");
  const loadingDiv = document.getElementById("loadingMsg");
  const loginBtn = document.getElementById("loginBtn");
  
  if (loadingDiv) loadingDiv.style.display = "none";
  if (loginBtn) loginBtn.disabled = false;
  
  if (errorDiv) {
    errorDiv.innerHTML = `<strong style="color: #fca5a5;">⚠ ${message}</strong>`;
    errorDiv.style.display = "block";
  }
}

function showLoading() {
  const errorDiv = document.getElementById("errorMsg");
  const loadingDiv = document.getElementById("loadingMsg");
  const loginBtn = document.getElementById("loginBtn");
  
  if (errorDiv) errorDiv.style.display = "none";
  if (loadingDiv) loadingDiv.style.display = "block";
  if (loginBtn) loginBtn.disabled = true;
}

function validateForm() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  
  let errors = [];
  
  if (!email || !email.includes("@")) errors.push("Valid email required");
  if (!password || password.length < 6) errors.push("Password must be at least 6 characters");
  
  if (errors.length > 0) {
    showError(errors.join(" | "));
    return false;
  }
  
  return true;
}

window.handleLogin = async function() {
  console.log("Login clicked");
  
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }
  
  showLoading();
  
  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    console.log("Attempting login with:", email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Login successful:", user.email);
    
    // Verify user profile exists
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        console.warn("User profile not found in Firestore");
      }
    } catch (docError) {
      console.error("Error checking user doc:", docError);
    }
    
    // Redirect to dashboard with a short delay to ensure auth state propagates
    console.log("Redirecting to dashboard...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
    
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    
    let errorMessage = error.message;
    if (error.code === "auth/user-not-found") {
      errorMessage = "Email not found. Please sign up first.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many login attempts. Please try again later.";
    }
    
    showError(errorMessage);
  }
};

// Handle Enter key to login
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.handleLogin();
      }
    });
  }
});

console.log("Login.js loaded successfully");