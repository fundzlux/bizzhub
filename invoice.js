import { db, auth } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

let business = "";
let customer = "";
let product = "";
let qty = 0;
let price = 0;
let total = 0;
let invoiceNumber = "";

// Wait for jsPDF to be available
function waitForjsPDF(callback, attempts = 0) {
    if (window.jspdf && window.jspdf.jsPDF) {
        callback();
    } else if (attempts < 50) {
        setTimeout(() => waitForjsPDF(callback, attempts + 1), 100);
    } else {
        console.error("jsPDF library failed to load");
    }
}

async function loadBusinessProfile() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        const snap = await getDoc(doc(db, "businesses", user.uid));
        if (snap.exists()) {
            const data = snap.data();
            if (document.getElementById("businessName")) {
                document.getElementById("businessName").value = data.businessName || "";
            }
        }
    } catch (error) {
        console.error("Profile sync error:", error);
    }
}

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

function validateForm() {
    const bName = document.getElementById("businessName")?.value.trim();
    const cName = document.getElementById("customerName")?.value.trim();
    const pName = document.getElementById("productName")?.value.trim();
    const qVal = document.getElementById("quantity")?.value.trim();
    const pVal = document.getElementById("price")?.value.trim();
    
    let errors = [];
    
    if (!bName) errors.push("Business Name");
    if (!cName) errors.push("Customer Name");
    if (!pName) errors.push("Product Name");
    if (!qVal || Number(qVal) <= 0) errors.push("Quantity (must be > 0)");
    if (!pVal || Number(pVal) <= 0) errors.push("Price (must be > 0)");
    
    if (errors.length > 0) {
        showError(`Fill these fields: ${errors.join(", ")}`);
        return false;
    }
    
    return true;
}

function generateInvoice() {
    console.log("Generate Invoice clicked");
    
    if (!validateForm()) {
        console.log("Validation failed");
        return;
    }
    
    try {
        const bName = document.getElementById("businessName");
        const cName = document.getElementById("customerName");
        const pName = document.getElementById("productName");
        const qVal = document.getElementById("quantity");
        const pVal = document.getElementById("price");
        const previewElement = document.getElementById("invoicePreview");

        if (!previewElement) {
            console.error("Preview element not found");
            return;
        }

        business = bName.value.trim();
        customer = cName.value.trim();
        product = pName.value.trim();
        qty = Number(qVal.value);
        price = Number(pVal.value);
        total = qty * price;
        invoiceNumber = "INV-" + Date.now();

        previewElement.innerHTML = `
            <h2>${business}</h2>
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Customer:</strong> ${customer}</p>
            <p><strong>Product:</strong> ${product}</p>
            <p><strong>Quantity:</strong> ${qty}</p>
            <p><strong>Price:</strong> ₦${price.toFixed(2)}</p>
            <hr style="border: 1px solid #1f2937; margin: 15px 0;">
            <h3 style="color: #38bdf8;">Total: ₦${total.toFixed(2)}</h3>
        `;
        
        showSuccess("Invoice generated successfully!");
        console.log("Invoice generated successfully!");
    } catch (error) {
        console.error("Generate error:", error);
        showError("Failed to generate invoice");
    }
}

async function downloadPDF() {
    console.log("Download PDF clicked");
    
    if (!validateForm()) {
        console.log("Validation failed");
        return;
    }
    
    if (!business || !invoiceNumber) {
        showError("Please generate an invoice first!");
        return;
    }
    
    try {
        // Check if jsPDF is available
        if (!window.jspdf || !window.jspdf.jsPDF) {
            showError("PDF library loading... please wait and try again");
            console.warn("jsPDF not ready, requesting it...", window.jspdf);
            waitForjsPDF(() => {
                console.log("jsPDF now available, retrying PDF generation");
            });
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(business, 20, 20);
        doc.setFontSize(11);
        doc.text(`Invoice #: ${invoiceNumber}`, 20, 35);
        doc.text(`Customer: ${customer}`, 20, 50);
        doc.text(`Product: ${product}`, 20, 65);
        doc.text(`Quantity: ${qty}`, 20, 80);
        doc.text(`Unit Price: ₦${price.toFixed(2)}`, 20, 95);
        doc.setFontSize(14);
        doc.text(`Total: ₦${total.toFixed(2)}`, 20, 120);
        
        doc.save(`Invoice-${invoiceNumber}.pdf`);
        showSuccess("PDF downloaded successfully!");
        console.log("PDF downloaded");
    } catch (error) {
        console.error('PDF Error:', error);
        showError("Failed to generate PDF: " + error.message);
    }
}

function uploadLogo() {
    console.log("Upload Logo clicked");
    
    try {
        const user = auth.currentUser;
        if (!user) {
            showError("Please login first");
            return;
        }
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    await setDoc(doc(db, "businesses", user.uid), {
                        logo: event.target.result
                    }, { merge: true });
                    
                    showSuccess("Logo uploaded successfully!");
                    console.log("Logo uploaded");
                } catch (error) {
                    console.error('Upload error:', error);
                    showError("Failed to upload logo");
                }
            };
            reader.readAsDataURL(file);
        };
        
        input.click();
    } catch (error) {
        console.error('Upload error:', error);
        showError("Upload failed: " + error.message);
    }
}

// Attach functions to buttons immediately and on DOMContentLoaded
function attachButtonListeners() {
    console.log("Attempting to attach button listeners");
    
    const genBtn = document.getElementById("btnGenerate");
    const dlBtn = document.getElementById("btnDownload");
    const upBtn = document.getElementById("btnUpload");

    console.log("Button elements found:", { genBtn: !!genBtn, dlBtn: !!dlBtn, upBtn: !!upBtn });

    if (genBtn) {
        genBtn.onclick = generateInvoice;
        genBtn.addEventListener("click", generateInvoice);
        console.log("✓ Generate button ready");
    } else {
        console.warn("Generate button not found");
    }
    
    if (dlBtn) {
        dlBtn.onclick = downloadPDF;
        dlBtn.addEventListener("click", downloadPDF);
        console.log("✓ Download button ready");
    } else {
        console.warn("Download button not found");
    }
    
    if (upBtn) {
        upBtn.onclick = uploadLogo;
        upBtn.addEventListener("click", uploadLogo);
        console.log("✓ Upload button ready");
    } else {
        console.warn("Upload button not found");
    }
}

// Try to attach immediately
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachButtonListeners);
} else {
    // DOM already loaded
    setTimeout(attachButtonListeners, 0);
}

// Also attach on DOMContentLoaded as fallback
document.addEventListener("DOMContentLoaded", attachButtonListeners);

// Load profile when user logs in
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User logged in, loading profile");
        loadBusinessProfile();
    }
});

console.log("Invoice.js loaded successfully");