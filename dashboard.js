import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// 📊 LOAD ALL STATS
async function loadDashboard() {

  const salesSnap = await getDocs(collection(db, "sales"));
  const productSnap = await getDocs(collection(db, "products"));
  const customerSnap = await getDocs(collection(db, "customers"));

  let totalSales = 0;
  let totalRevenue = 0;

  // SALES LOOP
  salesSnap.forEach(doc => {
    const s = doc.data();
    totalSales++;
    totalRevenue += s.total || 0;
  });

  document.getElementById("totalSales").innerText = totalSales;
  document.getElementById("totalRevenue").innerText = "₦" + totalRevenue;
  document.getElementById("totalProducts").innerText = productSnap.size;
  document.getElementById("totalCustomers").innerText = customerSnap.size;

  drawChart(salesSnap);
}

loadDashboard();
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

function liveDashboard() {

  onSnapshot(collection(db, "sales"), (snap) => {
    let totalSales = 0;
    let totalRevenue = 0;

    snap.forEach(doc => {
      const s = doc.data();
      totalSales++;
      totalRevenue += s.total || 0;
    });

    document.getElementById("totalSales").innerText = totalSales;
    document.getElementById("totalRevenue").innerText = "₦" + totalRevenue;

    drawChart(snap);
  });

  onSnapshot(collection(db, "products"), (snap) => {
    document.getElementById("totalProducts").innerText = snap.size;
  });

  onSnapshot(collection(db, "customers"), (snap) => {
    document.getElementById("totalCustomers").innerText = snap.size;
  });
}

liveDashboard();
async function checkLowStock() {
  const snap = await getDocs(collection(db, "products"));

  snap.forEach(doc => {
    const p = doc.data();

    if (p.quantity <= 5) {
      console.log("LOW STOCK ALERT:", p.name);
    }
  });
}
function calculateHealth(products, sales) {

  let score = 50;

  if (products > 10) score += 15;
  if (sales > 20) score += 20;
  if (sales > 50) score += 15;

  if (score > 100) score = 100;

  document.getElementById("healthScore").innerText =
    score + "/100";
}