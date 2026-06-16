import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function loadReport() {

  const sales =
    await getDocs(collection(db, "sales"));

  let totalRevenue = 0;

  sales.forEach(doc => {

    totalRevenue += doc.data().total || 0;

  });

  document.getElementById("reportBox")
  .innerHTML = `
    <h3>Business Report</h3>

    <p>Total Sales: ${sales.size}</p>

    <h2>Total Revenue: ₦${totalRevenue}</h2>

  `;
}

loadReport();