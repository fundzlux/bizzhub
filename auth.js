import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

window.logout = function () {

  signOut(auth).then(() => {

    alert("Logged out successfully");

    window.location.href = "login.html";

  });

};