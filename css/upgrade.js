import { db, auth } from "./firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

window.selectPlan = async function(plan) {

  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in");
    return;
  }

  await setDoc(doc(db, "users", user.uid), {
    plan: plan,
    updatedAt: new Date()
  }, { merge: true });

  alert("Plan updated: " + plan);

  window.location.href = "dashboard.html";
};