import { db, storage } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

// Display error/success messages
function showError(message) {
  const errorDiv = document.getElementById("validationError");
  if (errorDiv) {
    errorDiv.innerHTML = `<strong style="color: #fca5a5;">⚠ ${message}</strong>`;
    errorDiv.style.display = "block";
    errorDiv.style.background = "rgba(239, 68, 68, 0.2)";
    errorDiv.style.borderColor = "#ef4444";
  }
}

function showSuccess(message) {
  const errorDiv = document.getElementById("validationError");
  if (errorDiv) {
    errorDiv.innerHTML = `<strong style="color: #86efac;">✓ ${message}</strong>`;
    errorDiv.style.display = "block";
    errorDiv.style.background = "rgba(16, 185, 129, 0.2)";
    errorDiv.style.borderColor = "#10b981";
  }
}

// Validate form inputs
function validateSaleForm() {
  const product = document.getElementById("product")?.value.trim();
  const qty = document.getElementById("qty")?.value.trim();
  const price = document.getElementById("price")?.value.trim();
  
  let errors = [];
  
  if (!product) errors.push("Product Name");
  if (!qty || Number(qty) <= 0) errors.push("Quantity (must be > 0)");
  if (!price || Number(price) <= 0) errors.push("Price (must be > 0)");
  
  if (errors.length > 0) {
    showError(`Fill these fields: ${errors.join(", ")}`);
    return false;
  }
  
  return true;
}

// ➕ ADD SALE
window.addSale = async function() {
  console.log("Add Sale clicked");
  
  if (!validateSaleForm()) {
    console.log("Validation failed");
    return;
  }
  
  try {
    const product = document.getElementById("product").value.trim();
    const qty = document.getElementById("qty").value.trim();
    const price = document.getElementById("price").value.trim();
    const imageFile = document.getElementById("imageFile").files[0];

    const total = Number(qty) * Number(price);
    let imageUrl = "";

    // Upload image if provided
    if (imageFile) {
      try {
        const imageRef = ref(storage, `sales/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
        console.log("Image uploaded:", imageUrl);
      } catch (imgError) {
        console.warn("Image upload failed, saving sale without image", imgError);
      }
    }

    // Save sale to Firestore
    await addDoc(collection(db, "sales"), {
      product,
      quantity: Number(qty),
      price: Number(price),
      total,
      image: imageUrl,
      createdAt: serverTimestamp()
    });

    showSuccess("Sale added successfully!");
    console.log("Sale saved!");
    
    // Clear form
    document.getElementById("product").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("price").value = "";
    document.getElementById("imageFile").value = "";
    
    // Reload sales list
    loadSales();
  } catch (error) {
    console.error("Error adding sale:", error);
    showError("Failed to add sale: " + error.message);
  }
};

// 📊 LOAD SALES
async function loadSales() {
  try {
    console.log("Loading sales...");
    const snap = await getDocs(collection(db, "sales"));

    let html = "";
    let count = 0;

    snap.forEach(doc => {
      const s = doc.data();
      count++;
      
      html += `
        <div class="card" style="margin-bottom: 12px;">
          ${s.image ? `<img src="${s.image}" width="80" style="border-radius: 8px; margin-bottom: 10px;">` : ""}
          <h3 style="color: #38bdf8; margin: 0 0 8px 0;">${s.product}</h3>
          <p style="margin: 4px 0; color: #cbd5e1;">Quantity: ${s.quantity}</p>
          <p style="margin: 4px 0; color: #cbd5e1;">Price: ₦${s.price.toFixed(2)}</p>
          <p style="margin: 4px 0; color: #facc15; font-weight: bold;">Total: ₦${s.total.toFixed(2)}</p>
        </div>
      `;
    });

    if (count === 0) {
      html = `<p style="color: #94a3b8; text-align: center; padding: 20px;">No sales yet. Add your first sale above!</p>`;
    }

    document.getElementById("salesList").innerHTML = html;
    console.log(`Loaded ${count} sales`);
  } catch (error) {
    console.error("Error loading sales:", error);
    showError("Failed to load sales");
  }
}

// Load sales on page load
loadSales();

// Navigate to invoice
window.goInvoice = function() {
  console.log("Going to invoice page");
  window.location.href = "invoice.html";
};

console.log("Sales.js loaded successfully");