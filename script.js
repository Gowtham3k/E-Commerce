
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 3000); // Change slide every 3 seconds

// Sample product data with categories
const products = [
  { id: 1, name: 'Smart Refrigerator', price: 999.99, image: 'ref.jpeg' },
  { id: 2, name: 'Wireless Speaker', price: 150.00, image: 'speaker.jpeg' },
  { id: 3, name: 'Electric Kettle', price: 45.50, image: 'kettle.jpeg' },
  { id: 4, name: 'Air Fryer', price: 89.99, image: 'air.jpeg' },
  { id: 5, name: 'Robot Vacuum', price: 299.00, image: 'vac.jpeg' },
  { id: 6, name: 'Smart Thermostat', price: 120.00, image: 'smart.jpeg' },
  { id: 7, name: 'LED Desk Lamp', price: 35.00, image: 'led.jpeg' },
  { id: 8, name: 'Microwave Oven', price: 110.00, image: 'oven.jpeg' },
];
// Shopping Cart Functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Renders products based on a search query or category filter.
 * @param {string} searchQuery The search term to filter products.
 * @param {string} category The category to filter products by.
 */
function renderProducts(searchQuery = '', category = '') {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (filteredProducts.length === 0) {
    productList.innerHTML = '<p style="text-align: center; width: 100%; font-size: 1.2em; color: #777;">No products found.</p>';
  } else {
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p class="price">$${product.price.toFixed(2)}</p>
        <div class="actions">
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
        </div>
      `;
      productList.appendChild(productCard);
    });
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <p>${item.name} - $${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button onclick="decrementQuantity(${item.id})">-</button>
          <span>${item.quantity}</span>
          <button onclick="incrementQuantity(${item.id})">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price * item.quantity;
    });
  }

  document.getElementById('cart-total-price').textContent = total.toFixed(2);
  document.getElementById('cart-count').textContent = cart.length;
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
  alert('Product added to cart!');
}

function buyNow(productId) {
  const product = products.find(p => p.id === productId);
  cart = [{ ...product, quantity: 1 }];
  saveCart();
  renderCart();
  openPaymentModal();
}

function incrementQuantity(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
    saveCart();
    renderCart();
  }
}

function decrementQuantity(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--;
    saveCart();
    renderCart();
  }
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

// Modal logic
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const paymentModal = document.getElementById('payment-modal');
const closeBtns = document.querySelectorAll('.close-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentForm = document.getElementById('payment-form');

cartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex';
  renderCart();
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

checkoutBtn.addEventListener('click', () => {
  cartModal.style.display = 'none';
  openPaymentModal();
});

function openPaymentModal() {
  paymentModal.style.display = 'flex';
}

paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Payment Successful!');
  cart = [];
  saveCart();
  renderCart();
  paymentModal.style.display = 'none';
});

// Search and Dropdown Functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const dropdownLinks = document.querySelectorAll('.dropdown-content a');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  renderProducts(query);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value;
    renderProducts(query);
  }
});

dropdownLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = e.target.getAttribute('data-category');
    renderProducts('', category);
    // You can also add a visual indicator for the active category here.
  });
});

// Initial calls
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
});