import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// ➕ ADD PRODUCT
window.addProduct = async function () {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const qty = document.getElementById("qty").value;

  await addDoc(collection(db, "products"), {
    name,
    price: Number(price),
    quantity: Number(qty),
    createdAt: serverTimestamp()
  });

  alert("Product added!");
  loadProducts();
};

// 📦 LOAD PRODUCTS
async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));

  let html = "";

  snap.forEach(doc => {
    const p = doc.data();

    html += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>Price: ₦${p.price}</p>
        <p>Qty: ${p.quantity}</p>
      </div>
    `;
  });

  document.getElementById("list").innerHTML = html;
}

loadProducts();