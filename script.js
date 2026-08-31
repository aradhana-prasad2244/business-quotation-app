import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

let addRow = document.querySelector("#add-row");
let tableRow = document.querySelector(".tableRow");
let total = document.querySelector("#total");
let rowNumber = 1;

// Other than tableRow
let refNo = document.querySelector("#number");
let date = document.querySelector("#date");
let address = document.querySelector("#address");
let subject = document.querySelector("#userSub");

// Complete Quotation data
let quotations = JSON.parse(localStorage.getItem("quotations")) || [];

// ================= CREATE TABLE ROW =================

addRow.addEventListener("click", function () {
  // Create a new table row
  let tr = document.createElement("tr");

  // Create table cells
  let col1 = document.createElement("td");
  let col2 = document.createElement("td");
  let col3 = document.createElement("td");
  let col4 = document.createElement("td");
  let col5 = document.createElement("td");

  // Create input fields
  let inp1 = document.createElement("input");
  let inp2 = document.createElement("textarea");
  let inp3 = document.createElement("input");
  let inp4 = document.createElement("input");
  let inp5 = document.createElement("input");

  // Input types
  inp1.type = "text";
  inp3.type = "number";
  inp4.type = "text";
  inp5.type = "text";

  // CSS classes
  inp1.classList.add("inpCentreText");

  inp2.classList.add("inpStyle");

  inp3.classList.add("inpCentreText");

  inp4.classList.add("inpCentreText");

  inp5.classList.add("calculatedPrice");

  // Price is calculated automatically
  inp5.readOnly = true;

  // Row number
  inp1.value = rowNumber;
  rowNumber++;

  // ================= CALCULATE ROW PRICE =================

  function calculateRowPrice() {
    let quantity = Number(inp3.value) || 0;
    let charges = Number(inp4.value) || 0;

    let price = quantity * charges;

    inp5.value = price;

    calculateTotal();
  }

  // Quantity change
  inp3.addEventListener("input", calculateRowPrice);

  // Charges change
  inp4.addEventListener("input", calculateRowPrice);

  // ================= APPEND CELLS =================

  col1.append(inp1);
  col2.append(inp2);
  col3.append(inp3);
  col4.append(inp4);
  col5.append(inp5);

  tr.append(col1);
  tr.append(col2);
  tr.append(col3);
  tr.append(col4);
  tr.append(col5);

  tableRow.append(tr);

  // Calculate initial row price
  calculateRowPrice();
});

// ================= CALCULATE TOTAL =================

function calculateTotal() {
  let totalAmount = 0;

  let prices = document.querySelectorAll(".calculatedPrice");

  prices.forEach((price) => {
    totalAmount += Number(price.value) || 0;
  });

  total.textContent = totalAmount;
}

// ================= GET ITEMS =================

function getItems() {
  let items = [];

  let rows = document.querySelectorAll(".tableRow tr");

  rows.forEach((row) => {
    let no = row.children[0].querySelector("input");
    let description = row.children[1].querySelector("textarea");
    let quantity = row.children[2].querySelector("input");
    let charges = row.children[3].querySelector("input");
    let price = row.children[4].querySelector("input");

    let descriptionValue = description.value.trim();
    let quantityValue = Number(quantity.value) || 0;
    let chargesValue = Number(charges.value) || 0;
    let priceValue = quantityValue * chargesValue;

    // Skip completely empty rows
    if (
      descriptionValue === "" &&
      quantityValue === 0 &&
      chargesValue === 0
    ) {
      return;
    }

    let item = {
      no: no.value,
      description: descriptionValue,
      quantity: quantityValue,
      charges: chargesValue,
      price: priceValue,
    };

    items.push(item);
  });

  return items;
}

// ================= CREATE COMPLETE QUOTATION =================

function createQuotation() {
  let items = getItems();

  // Total = sum of all prices
  let totalAmount = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  let quotation = {
    id: Date.now(),
    refNo: refNo.value,
    date: date.value,
    address: address.value,
    subject: subject.value,
    items: items,
    total: totalAmount,
  };

  return quotation;
}

// ================= SAVE QUOTATION =================

function saveQuotation() {
  let quotation = createQuotation();

  quotations.push(quotation);

  localStorage.setItem(
    "quotations",
    JSON.stringify(quotations)
  );

  console.log("Saved quotation:");
  console.log(quotation);

  console.log("All quotations:");
  console.log(quotations);
}

// ================= SIGNATURE IMAGE =================

const signatureImage = new Image();

signatureImage.src = "/signature.png";

// ================= DOWNLOAD PDF =================

let downloadPdf = document.querySelector("#download-pdf");

downloadPdf.addEventListener("click", async function () {
  try {
    saveQuotation();

    // Wait until signature image is loaded
    await new Promise((resolve, reject) => {
      if (signatureImage.complete) {
        resolve();
      } else {
        signatureImage.onload = resolve;
        signatureImage.onerror = reject;
      }
    });

    const doc = new jsPDF();

    // A4 page width
    const pageWidth = 210;

    // ================= HEADER =================

    // Mobile number
    doc.setFont("times", "bold");
    doc.setFontSize(10);

    doc.text(
      "Mobile : 9167272509",
      pageWidth - 15,
      10,
      {
        align: "right",
      }
    );

    // Company name
    doc.setTextColor("#e10202");
    doc.setFontSize(25);

    doc.text(
      "ARADHANA ENGINEERING WORKS",
      pageWidth / 2,
      22,
      {
        align: "center",
      }
    );

    // Company subtitle
    doc.setTextColor("#0194e3");
    doc.setFontSize(15);

    doc.text(
      "Machinist & Fabricators",
      pageWidth / 2,
      29,
      {
        align: "center",
      }
    );

    // Specialist line
    doc.setFontSize(11);

    doc.text(
      "Specialist in : Spares in Machinery and Equipments, Foundation Bolts, Flanges, Studs Etc.",
      pageWidth / 2,
      35,
      {
        align: "center",
      }
    );

    doc.text(
      "We undertake Project Work and Plant Maintenance",
      pageWidth / 2,
      40,
      {
        align: "center",
      }
    );

    // Change color back to black
    doc.setTextColor("#000000");

    // Top horizontal line
    doc.line(15, 43, 195, 43);

    // Works address
    doc.setFontSize(11);

    doc.text(
      "Works : 24, Lotlikar Compound, Behind Hindalco Ltd., MIDC Taloja, Dist : Raigad",
      pageWidth / 2,
      48,
      {
        align: "center",
      }
    );

    // Email
    doc.text(
      "Email : aradhanaenggworks55@gmail.com",
      pageWidth / 2,
      53,
      {
        align: "center",
      }
    );

    // Bottom line
    doc.line(15, 56, 195, 56);

    // ================= QUOTATION DETAILS =================

    doc.setFont("times", "bold");
    doc.setFontSize(11);

    // Ref. No.
    doc.text(
      `Ref. No.: ${refNo.value}`,
      20,
      68
    );

    // Date
    doc.text(
      `Date: ${date.value}`,
      165,
      68,
      {
        align: "center",
      }
    );

    // Address
    const addressLines = doc.splitTextToSize(
      address.value,
      80
    );

    doc.text(
      addressLines,
      20,
      78
    );

    // Subject
    const subjectText =
      `Sub:- ${subject.value.replace("Sub:-", "").trim()}`;

    const subjectLines = doc.splitTextToSize(
      subjectText,
      170
    );

    doc.text(
      subjectLines,
      pageWidth / 2,
      103,
      {
        align: "center",
      }
    );

    // ================= TABLE =================

    const items = getItems();

    autoTable(doc, {
      startY: 115,

      head: [
        [
          "No.",
          "Description",
          "Quantity",
          "Charges",
          "Price",
        ],
      ],

      body: items.map((item) => [
        item.no,
        item.description,
        item.quantity,
        `Rs. ${item.charges}`,
        `Rs. ${item.price}`,
      ]),

      margin: {
        left: 15,
        right: 15,
      },

      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: "middle",
      },

      // HEADER ALIGNMENT
      headStyles: {
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },

      // BODY ALIGNMENT
      columnStyles: {
        0: {
          cellWidth: 15,
          halign: "center",
        },

        1: {
          cellWidth: 70,
          halign: "left",
        },

        2: {
          cellWidth: 25,
          halign: "center",
        },

        3: {
          cellWidth: 35,
          halign: "center",
        },

        4: {
          cellWidth: 35,
          halign: "center",
        },
      },

      // Make Description header left-aligned
      didParseCell: function (data) {
        if (
          data.section === "head" &&
          data.column.index === 1
        ) {
          data.cell.styles.halign = "left";
        }
      },
    });

    // ================= TOTAL =================

    const totalAmount = items.reduce(
      (sum, item) => {
        return sum + item.price;
      },
      0
    );

    doc.setFont("times", "bold");
    doc.setFontSize(11);

    doc.text(
      `Total : Rs. ${totalAmount}`,
      180,
      doc.lastAutoTable.finalY + 8,
      {
        align: "right",
      }
    );

    // ================= FOOTER =================

    doc.setFont("times", "bold");
    doc.setFontSize(11);

    // Thanking You
    doc.text(
      "Thanking You,",
      20,
      260
    );

    // Right side footer
    doc.text(
      "Yours Faithfully,",
      165,
      262,
      {
        align: "center",
      }
    );

    doc.text(
      "For Aradhana Engineering Work",
      165,
      269,
      {
        align: "center",
      }
    );

    // Signature
    doc.addImage(
      signatureImage,
      "PNG",
      155,
      273,
      20,
      12
    );

    // Proprietor
    doc.text(
      "Proprietor",
      165,
      288,
      {
        align: "center",
      }
    );

    // Download PDF
    doc.save("quotation.pdf");

  } catch (error) {
    console.error(
      "Error generating PDF:",
      error
    );

    alert(
      "Unable to generate PDF. Please try again."
    );
  }
});