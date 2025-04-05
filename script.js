const products = [
    { id: 1, name: "Smartphone", price: 499, category: "electronics", img: "smart.jpg" },
    { id: 2, name: "T-Shirt", price: 19, category: "fashion", img: "shirt.jpg" },
    { id: 3, name: "Novel Book", price: 12, category: "books", img: "harry.jpg" },
    { id: 4, name: "Headphones", price: 89, category: "electronics", img: "head.jpg" },
    { id: 5, name: "Sneakers", price: 49, category: "fashion", img: "sneak.jpg" }
  ];
  
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category-filter");
  const cartCount = document.getElementById("cart-count");
  const toggleThemeBtn = document.getElementById("toggle-theme");
  
  const cartIcon = document.getElementById("cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const orderButton = document.getElementById("order-button");
  const orderSuccess = document.getElementById("order-success");
  
  let cart = [];
  
  function displayProducts(items) {
    productList.innerHTML = "";
    items.forEach(product => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(card);
    });
  }
  
  function addToCart(productId) {
    const item = cart.find(p => p.id === productId);
    if (item) {
      item.quantity++;
    } else {
      const product = products.find(p => p.id === productId);
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
  }
  
  function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  function renderCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.textContent = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
      cartItemsContainer.appendChild(div);
    });
    cartTotal.textContent = total.toFixed(2);
    orderSuccess.classList.add("hidden");
  }
  
  function filterProducts() {
    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search) &&
      (category === "all" || p.category === category)
    );
    displayProducts(filtered);
  }
  
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
  
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleThemeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
  
  cartIcon.addEventListener("click", () => {
    renderCartModal();
    cartModal.classList.remove("hidden");
  });
  
  closeCart.addEventListener("click", () => {
    cartModal.classList.add("hidden");
  });
  
  orderButton.addEventListener("click", () => {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
    renderCartModal();
    orderSuccess.classList.remove("hidden");
  });
  
  displayProducts(products);
  