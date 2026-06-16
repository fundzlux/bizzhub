import { db, auth } from "./firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

window.saveBusinessProfile = async function() {

  const user = auth.currentUser;

  await setDoc(
    doc(db, "businesses", user.uid),
    {
      businessName:
        document.getElementById("businessName").value,

      phone:
        document.getElementById("phone").value,

      address:
        document.getElementById("address").value
    },
    { merge: true }
  );

  alert("Profile Saved");
}