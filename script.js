// ✅ Global products array
let products = [];
let filteredProducts = []; // filtered list for search
let currentIndex = 0;
const pageSize = 15;

// 📌 Google Sheet CSV Link (Published as CSV)
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlrxWsu4bchDXwiDcitxq71ZJAVmpkEeAdBvRXox9OWiDS5O1qwBetSjcFjmuRVP7FeZIF609O2n1H/pub?gid=0&single=true&output=csv";

// 🔹 Fetch data from Google Sheets on page load
fetch(SHEET_URL)
  .then((res) => res.text())
  .then((text) => {
    let rows = text.split("\n").slice(1); // skip header

    products = rows.map((row) => {
      let [name, price, qty, image] = row.split(",");
      return {
        name: name || "Unknown",
        price: price || 0,
        qty: qty || 0,
        image: image || "https://via.placeholder.com/80",
      };
    });

    filteredProducts = products; // initially no filter
    displayProducts(true); // display first 15
  })
  .catch((err) => console.error("Error fetching CSV:", err));

// 🔹 Display products with paging
function displayProducts(initial = false) {
  const box = document.getElementById("products");
  if (initial) box.innerHTML = ""; // clear on new search
  const nextProducts = filteredProducts.slice(
    currentIndex,
    currentIndex + pageSize
  );

  nextProducts.forEach((p) => {
    box.innerHTML += `
      <div class="card">
        <img src="${p.image}" onerror="this.src='https://via.placeholder.com/80'">
        <div class="info">
          <b class="product-name">${p.name}</b><br>
          <span class="price">💲តម្លៃ ${p.price}$</span><br>
          <span class="qty">☑️ ប្រភេទ: ${p.qty}</span>
        </div>
      </div>
    `;
  });

  currentIndex += pageSize;

  // hide See More button if no more products
  document.getElementById("loadMoreBtn").style.display =
    currentIndex >= filteredProducts.length ? "none" : "block";
}

// 🔹 Search products
function searchProduct() {
  const keyword = document.getElementById("search").value.toLowerCase();
  filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(keyword)
  );
  currentIndex = 0; // reset index
  displayProducts(true); // show first page of search result
}

// 🔹 See More button
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  displayProducts();
});
