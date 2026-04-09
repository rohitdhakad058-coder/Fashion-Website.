/* ================================================
   STYLEHAVEN - JavaScript
   Simple, easy to understand functions
   ================================================ */


// ── 1. PRODUCT DATA ──────────────────────────────
// All products stored in one array
const products = [
  {
    id: 1,
    name: "Xl Straight Jeans - Blue | Levi's® ",
    category: "Women",
    price: 2000,
    oldPrice: 2500,
    image: "levis jeans.jpg",
    badge: "Sale",
    rating: 5,
    reviews: 124
  },
  {
    id: 2,
    name: "Baggy - Jeans - Collection",
    category: "Women",
    price: 5000,
    oldPrice: null,
    image: "baggy jeans.jpg",
    badge: null,
    rating: 4,
    reviews: 89
  },
  {
    id: 3,
    name: "WOOL BLEND JACKET",
    category: "Men",
    price: 5500,
    oldPrice: 7000,
    image: "jacket.jpg",
    badge: "Sale",
    rating: 5,
    reviews: 78
  },
  {
    id: 4,
    name: " Puffer Jacket Mens Zara",
    category: "Men",
    price: 6000,
    oldPrice: null,
    image: "jacket1.jpg",
    badge: "New",
    rating: 4,
    reviews: 112
  },
  
  {
    id: 5,
    name: "Leather Tote Bag",
    category: "Accessories",
    price: 7000,
    oldPrice: 8000,
    image: "baggg.jpg",
    badge: "Sale",
    rating: 5,
    reviews: 67
  },
  {
    id: 6,
    name: "Zara man leather jacket",
    category: "Men",
    price: 6500,
    oldPrice: 7000,
    image: "zara.jpg",
    badge: "Sale",
    rating: 5,
    reviews: 56
  },
  {
    id: 7,
    name: "Women-Jacket",
    category: "Women",
    price: 3000,
    oldPrice: 4000,
    image: "women.jpg",
    badge: "New",
    rating: 4,
    reviews: 156
  },
  {
    id: 8,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 2800,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    badge: "New",
    rating: 4,
    reviews: 84
  }
];


// ── 2. CART (stored in browser localStorage) ─────
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Save cart and update the badge number
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Add a product to the cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1; // Already in cart → increase quantity
  } else {
    cart.push({ ...product, qty: 1 }); // New item → add to cart
  }

  saveCart();
  showToast(product.name + " added to cart!");
}

// Remove an item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart(); // Refresh the cart page
}

// Change quantity in cart
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(productId); // Remove if qty reaches 0
  } else {
    saveCart();
    renderCart();
  }
}

// Get total price of cart
function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.qty, 0);
}

// Update the cart number shown in navbar
function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = count;
}


// ── 3. AUTH (stored in localStorage) ─────────────
let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

// Register a new user
function register(name, email, password) {
  const exists = users.find(u => u.email === email);
  if (exists) return false; // Email already used

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

// Login existing user
function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return false;

  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  return true;
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Update navbar to show username or login link
function updateNavAuth() {
  const loginLink = document.getElementById("login-link");
  const userInfo  = document.getElementById("user-info");
  const userName  = document.getElementById("user-name");

  if (currentUser) {
    if (loginLink) loginLink.classList.add("d-none");
    if (userInfo)  userInfo.classList.remove("d-none");
    if (userName)  userName.textContent = currentUser.name;
  } else {
    if (loginLink) loginLink.classList.remove("d-none");
    if (userInfo)  userInfo.classList.add("d-none");
  }
}


// ── 4. PRODUCT CARD HTML ─────────────────────────
// Builds the Bootstrap card HTML for one product
function productCard(p) {
  const badge = p.badge
    ? `<span class="badge product-badge ${p.badge === "Sale" ? "bg-danger" : "bg-dark"}">${p.badge}</span>`
    : "";

  const oldPrice = p.oldPrice
    ? `<small class="text-muted text-decoration-line-through ms-2">₹${p.oldPrice}</small>`
    : "";

  const stars = "★".repeat(p.rating) + "☆".repeat(5 - p.rating);

  return `
    <div class="col">
      <div class="card product-card shadow-sm h-100">
        <div class="position-relative">
          ${badge}
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
        </div>
        <div class="card-body d-flex flex-column">
          <small class="text-muted text-uppercase">${p.category}</small>
          <h6 class="card-title mt-1 mb-1">${p.name}</h6>
          <div class="stars mb-1">${stars}
            <small class="text-muted ms-1">(${p.reviews})</small>
          </div>
          <p class="fw-bold mt-auto mb-0">
            ₹${p.price.toFixed(2)} ${oldPrice}
          </p>
          <button class="btn btn-dark btn-sm mt-3 w-100"
                  onclick="addToCart(${p.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}


// ── 5. SHOP PAGE - Render & Filter Products ───────
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted"></i>
        <p class="mt-3 text-muted">No products found.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(productCard).join("");
  document.getElementById("result-count").textContent =
    list.length + " product" + (list.length !== 1 ? "s" : "") + " found";
}

function filterProducts() {
  const category = document.getElementById("filter-category")?.value || "";
  const maxPrice  = parseFloat(document.getElementById("filter-price")?.value || 9999);
  const search    = document.getElementById("filter-search")?.value.toLowerCase() || "";
  const sort      = document.getElementById("filter-sort")?.value || "";

  let result = [...products];

  // Apply filters
  if (category) result = result.filter(p => p.category === category);
  if (search)   result = result.filter(p => p.name.toLowerCase().includes(search));
  result = result.filter(p => p.price <= maxPrice);

  // Apply sort
  if (sort === "low")    result.sort((a, b) => a.price - b.price);
  if (sort === "high")   result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

  renderProducts(result);
}


// ── 6. CART PAGE - Render Cart ────────────────────
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-bag fs-1 text-muted"></i>
        <p class="mt-3 text-muted">Your cart is empty.</p>
        <a href="shop.html" class="btn btn-dark mt-2">Go Shopping</a>
      </div>`;
    document.getElementById("cart-summary").innerHTML = "";
    return;
  }

  // Render each cart item as a Bootstrap list group row
  container.innerHTML = cart.map(item => `
    <div class="list-group-item p-3">
      <div class="row align-items-center g-3">
        <div class="col-3 col-md-2">
          <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
        </div>
        <div class="col-6 col-md-7">
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">₹${item.price.toFixed(2)} each</small>
          <div class="d-flex align-items-center gap-2 mt-2">
            <button class="btn btn-outline-secondary btn-sm"
                    onclick="changeQty(${item.id}, -1)">−</button>
            <span class="fw-bold">${item.qty}</span>
            <button class="btn btn-outline-secondary btn-sm"
                    onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="col-3 text-end">
          <p class="fw-bold mb-1">₹${(item.price * item.qty).toFixed(2)}</p>
          <button class="btn btn-outline-danger btn-sm"
                  onclick="removeFromCart(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Show order summary
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total    = subtotal + shipping;

  document.getElementById("cart-summary").innerHTML = `
    <div class="card border-0 bg-light p-4">
      <h5 class="mb-3">Order Summary</h5>
      <div class="d-flex justify-content-between mb-2">
        <span>Subtotal</span><strong>₹${subtotal.toFixed(2)}</strong>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <span>Shipping</span>
        <strong>${shipping === 0 ? '<span class="text-success">Free</span>' : "" + shipping.toFixed(2)}</strong>
      </div>
      <hr>
      <div class="d-flex justify-content-between mb-3">
        <strong>Total</strong><strong class="fs-5">₹${total.toFixed(2)}</strong>
      </div>
      <button class="btn btn-dark w-100" onclick="checkout()">
        Checkout &rarr;
      </button>
      <a href="shop.html" class="btn btn-outline-secondary w-100 mt-2">
        Continue Shopping
      </a>
    </div>
  `;
}

function checkout() {
  if (!currentUser) {
    showToast("Please login to checkout!");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }
  cart = [];
  saveCart();
  renderCart();
  showToast("Order placed successfully! 🎉");
}


// ── 7. TOAST NOTIFICATION ─────────────────────────
function showToast(message) {
  const toast = document.getElementById("toast-msg");
  if (toast) toast.textContent = message;

  const toastEl = document.getElementById("toast");
  if (toastEl) {
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
    bsToast.show();
  }
}


// ── 8. RUN ON PAGE LOAD ───────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
  updateNavAuth();z
});
