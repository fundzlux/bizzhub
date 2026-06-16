import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

function showError(message) {
  const errorDiv = document.getElementById("errorMsg");
  if (errorDiv) {
    errorDiv.innerHTML = `<strong style="color: #fca5a5;">⚠ ${message}</strong>`;
    errorDiv.style.display = "block";
  }
}

function validateForm() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const confirmPassword = document.getElementById("confirmPassword")?.value.trim();
  
  let errors = [];
  
  if (!email || !email.includes("@")) errors.push("Valid email required");
  if (!password || password.length < 6) errors.push("Password must be at least 6 characters");
  if (password !== confirmPassword) errors.push("Passwords do not match");
  
  if (errors.length > 0) {
    showError(errors.join(" | "));
    return false;
  }
  
  return true;
}

window.handleSignup = async function() {
  console.log("Signup clicked");
  
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }
  
  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    console.log("Attempting signup with:", email);
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("User created:", user.email);
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      plan: "free",
      businessName: "",
      phone: "",
      address: ""
    });
    
    console.log("User profile created in Firestore");
    
    // Create empty businesses collection entry
    await setDoc(doc(db, "businesses", user.uid), {
      email: user.email,
      createdAt: serverTimestamp()
    });
    
    console.log("Signup successful!");
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
    
  } catch (error) {
    console.error("Signup error:", error.code, error.message);
    
    let errorMessage = error.message;
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already registered. Please login instead.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password too weak. Use at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format.";
    }
    
    showError(errorMessage);
  }
};

console.log("Signup.js loaded successfully");