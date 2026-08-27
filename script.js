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

addRow.addEventListener("click", function (dets) {
  // create a new table row
  let tr = document.createElement("tr");

  // create table data
  let col1 = document.createElement("td");
  let col2 = document.createElement("td");
  let col3 = document.createElement("td");
  let col4 = document.createElement("td");

  // creating a input field
  let inp1 = document.createElement("input");
  let inp2 = document.createElement("textarea");
  let inp3 = document.createElement("input");
  let inp4 = document.createElement("input");

  // setting input attributes
  inp1.setAttribute("type", "text");
  inp2.setAttribute("type", "text");
  inp3.setAttribute("type", "text");
  inp4.setAttribute("type", "text");

  // CSS classes
  inp1.classList.add("inpCentreText");
  inp2.classList.add("inpStyle");
  inp3.classList.add("inpStyle");
  inp4.classList.add("inpCentreText");
  inp4.classList.add("price");

  inp1.value = rowNumber;
  rowNumber++;

  // event for content column
  inp2.addEventListener("input", function (dets) {
    inp2.value = dets.target.value;
  });

  // event for charges column
  inp3.addEventListener("input", function (dets) {
    inp3.value = dets.target.value;
  });

  // price input
  inp4.addEventListener("input", function () {
    calculateTotal();
  });

  // input field inside in td
  col1.append(inp1);
  col2.append(inp2);
  col3.append(inp3);
  col4.append(inp4);

  // td inside in tr
  tr.prepend(col1);
  tr.append(col2);
  tr.append(col3);
  tr.append(col4);

  // Add row to tbody
  tableRow.append(tr);
});

// Calculate Total
function calculateTotal() {
  let totalAmount = 0;
  let prices = document.querySelectorAll(".price");

  prices.forEach((price) => {
    totalAmount += Number(price.value) || 0;
  });

  total.textContent = totalAmount;
}

function getItems() {
  let items = [];
  let rows = document.querySelectorAll(".tableRow tr");

  rows.forEach((row) => {
    let no = row.children[0].querySelector("input");
    let content = row.children[1].querySelector("textarea");
    let charges = row.children[2].querySelector("input");
    let price = row.children[3].querySelector("input");

    let contentValue = content.value.trim();
    let chargesValue = charges.value.trim();
    let priceValue = price.value.trim();

    // Skip the row if all fields are empty
    if (contentValue === "" && chargesValue === "" && priceValue === "") {
      return;
    }

    let item = {
      no: no.value,
      content: contentValue,
      charges: chargesValue,
      price: Number(priceValue) || 0,
    };

    items.push(item);
  });

  return items;
}

// Create Complete Quotation Object
function createQuotation() {
  let items = getItems();

  // Calculate total using reduce
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

// Saved Quotation
function saveQuotation() {
  let quotation = createQuotation();

  // Add new quotation to array
  quotations.push(quotation);

  // Save array into localStorage
  localStorage.setItem("quotations", JSON.stringify(quotations));

  console.log("Saved quotation:");

  console.log(quotation);

  console.log("All quotations:");

  console.log(quotations);
}

const signatureImage = new Image();
signatureImage.src = "/assets/signature.png";

// Download Pdf
let downloadPdf = document.querySelector("#download-pdf");

downloadPdf.addEventListener("click", async function () {
  // Wait until signature image is loaded

  saveQuotation();
  await new Promise((resolve, reject) => {
    if (signatureImage.complete) {
      resolve();
    } else {
      signatureImage.onload = resolve;
      signatureImage.onerror = reject;
    }
  });

  const doc = new jsPDF();

  // A4 page width = 210mm
  const pageWidth = 210;

  // ****************** Header *******************************

  // Mobile number
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("Mobile : 9167272509", pageWidth - 15, 10, {
    align: "right",
  });

  // Company name
  doc.setTextColor("#e10202");
  doc.setFontSize(25);
  doc.text("ARADHANA ENGINEERING WORKS", pageWidth / 2, 22, {
    align: "center",
  });

  // Company subtitle
  doc.setTextColor("#0194e3");
  doc.setFontSize(15);
  doc.text("Machinist & Fabricators", pageWidth / 2, 29, {
    align: "center",
  });

  // Specialist line
  doc.setTextColor("#0194e3");
  doc.setFontSize(11);

  doc.text(
    "Specialist in : Spares in Machinery and Equipments, Foundation Bolts, Flanges, Studs Etc.",
    pageWidth / 2,
    35,
    {
      align: "center",
    },
  );

  doc.text(
    "We undertake Project Work and Plant Maintenance",
    pageWidth / 2,
    40,
    {
      align: "center",
    },
  );

  // Change color back to black
  doc.setTextColor("#000000");

  // Horizontal line
  doc.line(15, 43, 195, 43);

  // Works address
  doc.setFontSize(11);
  doc.text(
    "Works : 24, Lotlikar Compound, Behind Hindalco Ltd., MIDC Taloja, Dist : Raigad",
    pageWidth / 2,
    48,
    {
      align: "center",
    },
  );

  // Horizontal line
  doc.line(15, 43, 195, 43);

  // Works address
  doc.setFontSize(11);
  doc.text(
    "Works : 24, Lotlikar Compound, Behind Hindalco Ltd., MIDC Taloja, Dist : Raigad",
    pageWidth / 2,
    48,
    {
      align: "center",
    },
  );

  // Email
  doc.text("Email : aradhanaenggworks55@gmail.com", pageWidth / 2, 53, {
    align: "center",
  });

  // Bottom line
  doc.line(15, 56, 195, 56);

  // *********************** QUOTATION DETAILS ************************

  doc.setFont("times", "bold");
  doc.setFontSize(11);

  // Ref. No.
  doc.text(`Ref. No.: ${refNo.value}`, 20, 68);

  // Date
  doc.text(`Date: ${date.value}`, 165, 68, {
    align: "center",
  });

  // Address
  const addressLines = doc.splitTextToSize(address.value, 80);

  doc.text(addressLines, 20, 78);

  // Subject
  const subjectText = `Sub:- ${subject.value.replace("Sub:-", "").trim()}`;

  const subjectLines = doc.splitTextToSize(subjectText, 170);

  doc.text(subjectLines, pageWidth / 2, 103, {
    align: "center",
  });

  // *********************** TABLE ************************

  autoTable(doc, {
    startY: 115,

    head: [["No.", "Content", "Charges", "Price"]],

    body: getItems().map((item) => [
      item.no,
      item.content,
      item.charges,
      item.price,
    ]),

    margin: {
      left: 15,
      right: 15,
    },
  });

  // ************************* Total ************************

  const items = getItems();

  const totalAmount = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  doc.setFont("times", "bold");
  doc.setFontSize(11);

  doc.text(`Total : Rs. ${totalAmount}`, 170, doc.lastAutoTable.finalY + 8, {
    align: "right",
  });

  // FOOTER
  // ...

  // ************************* Footer ****************************

  doc.setFont("times", "bold");
  doc.setFontSize(11);

  // Thanking You - left side
  doc.text("Thanking You,", 20, 260);

  // Right side footer
  doc.text("Yours Faithfully,", 165, 262, {
    align: "center",
  });

  doc.text("For Aradhana Engineering Work", 165, 269, {
    align: "center",
  });

  // SIGNATURE IMAGE
  doc.addImage(
    signatureImage,
    "PNG",
    155, // X
    273, // Y
    20, // Width
    12, // Height
  );

  // Proprietor
  doc.text("Proprietor", 165, 288, {
    align: "center",
  });

  doc.save("quotation.pdf");
});
