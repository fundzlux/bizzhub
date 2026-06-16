import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function loadInsights() {

  const salesSnap = await getDocs(collection(db, "sales"));
  const productsSnap = await getDocs(collection(db, "products"));

  const productSales = {};
  const customerSpend = {};

  let lowStockHTML = "";

  productsSnap.forEach(doc => {

    const p = doc.data();

    if (p.quantity <= 5) {
      lowStockHTML += `
      <div class="card">
        ⚠ ${p.name} only ${p.quantity} left
      </div>`;
    }
  });

  salesSnap.forEach(doc => {

    const s = doc.data();

    if (!productSales[s.product]) {
      productSales[s.product] = 0;
    }

    productSales[s.product] += s.quantity || 1;

    if (s.customer) {

      if (!customerSpend[s.customer]) {
        customerSpend[s.customer] = 0;
      }

      customerSpend[s.customer] += s.total || 0;
    }

  });

  let bestProduct = "None";
  let bestCount = 0;

  for (let p in productSales) {

    if (productSales[p] > bestCount) {

      bestCount = productSales[p];
      bestProduct = p;

    }
  }

  let topCustomer = "None";
  let topSpend = 0;

  for (let c in customerSpend) {

    if (customerSpend[c] > topSpend) {

      topSpend = customerSpend[c];
      topCustomer = c;

    }
  }

  document.getElementById("bestProduct").innerText = bestProduct;
  document.getElementById("topCustomer").innerText = topCustomer;
  document.getElementById("lowStock").innerHTML = lowStockHTML;

  calculateHealth(productsSnap.size, salesSnap.size);
}

loadInsights();