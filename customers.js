import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// ➕ ADD CUSTOMER
window.addCustomer = async function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  await addDoc(collection(db, "customers"), {
    name,
    phone,
    createdAt: serverTimestamp()
  });

  alert("Customer saved!");
  loadCustomers();
};

// 📊 LOAD CUSTOMERS
async function loadCustomers() {
  const snap = await getDocs(collection(db, "customers"));

  let html = "";

  snap.forEach(doc => {
    const c = doc.data();

    html += `
      <div class="card">
        <h3>${c.name}</h3>
        <p>${c.phone}</p>
      </div>
    `;
  });

  document.getElementById("list").innerHTML = html;
}

loadCustomers();