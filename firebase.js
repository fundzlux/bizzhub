console.log("Firebase.js initializing...");

try {
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

  console.log("Firebase modules imported successfully");

  const firebaseConfig = {
    apiKey: "AIzaSyAF-EmPez9DE-lnPQEToMJlpWaNMAOtnwE",
    authDomain: "buisness-saas.firebaseapp.com",
    projectId: "buisness-saas",
    storageBucket: "buisness-saas.firebasestorage.app",
    messagingSenderId: "802405642046",
    appId: "1:802405642046:web:80faef25453e62cf46866f",
    measurementId: "G-VQBEJN79K6"
  };

  console.log("Firebase config loaded:", firebaseConfig.projectId);

  const app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized");

  export const db = getFirestore(app);
  export const auth = getAuth(app);
  export const storage = getStorage(app);

  console.log("Firebase exports ready");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw new Error("Firebase failed to initialize: " + error.message);
}