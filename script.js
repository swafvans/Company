// In-Memory Storage for Session Data
let products = [];
let orders = [];
let messages = [];
let cart = [];

// Utility Functions
function getProducts() {
  return products;
}

function saveProducts(newProducts) {
  products = newProducts;
}

function getOrders() {
  return orders;
}

function saveOrders(newOrders) {
  orders = newOrders;
}

function getMessages() {
  return messages;
}

function saveMessages(newMessages) {
  messages = newMessages;
}

function getCart() {
  return cart;
}

function saveCart(newCart) {
  cart = newCart;
}

function getProductById(id) {
  return getProducts().find(p => p.id === id) || null;
}

function deleteProduct(id) {
  const updatedProducts = getProducts().filter(p => p.id !== id);
  saveProducts(updatedProducts);
}

function recordOrder(productIds, totalAmount) {
  const newOrders = getOrders();
  const order = {
    id: Date.now().toString(),
    productIds,
    totalAmount,
    date: new Date().toLocaleString()
  };
  newOrders.push(order);
  saveOrders(newOrders);
}

function showCart() {
  const cartItems = getCart();
  const products = getProducts();
  const modal = document.createElement('div');
  modal.className = 'cart-modal';
  modal.innerHTML = `
    <div class="cart-content">
      <h2>Your Cart</h2>
      <ul>
        ${cartItems.map(id => {
          const product = getProductById(id);
          return product ? `<li>${product.name} - ₹${product.price}</li>` : '';
        }).join('')}
      </ul>
      <button onclick="document.querySelector('.cart-modal').remove()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

// Load Products from JSON
async function loadInitialProducts() {
  try {
    const response = await fetch('products.json');
    const data = await response.json();
    saveProducts(data);
  } catch (error) {
    console.error('Error loading products:', error);
    saveProducts([]);
  }
}

// Page Logic
document.addEventListener('DOMContentLoaded', async () => {
  await loadInitialProducts(); // Load products from JSON on page load

  const path = window.location.pathname;

  // Add cart link event listener to all pages
  document.querySelectorAll('.nav-cart').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showCart();
    });
  });

  // Homepage
  if (path.includes('index.html') || path === '/') {
    const grid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');

    function displayProducts(filteredProducts) {
      grid.innerHTML = '';
      filteredProducts.forEach(product => {
        grid.innerHTML += `
          <div class="product-item">
            <a href="product.html?id=${product.id}">
              <img src="${product.images[0]}" alt="${product.name}">
            </a>
            <div class="product-info">
              <h3>${product.name}</h3>
              <p class="price">₹${product.price}</p>
              <a href="product.html?id=${product.id}">View</a>
            </div>
          </div>
        `;
      });
    }

    displayProducts(products);

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
      displayProducts(filtered);
    });

    document.getElementById('messageForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const message = document.getElementById('message').value;
      const newMessages = getMessages();
      newMessages.push({ text: message, timestamp: new Date().toLocaleString() });
      saveMessages(newMessages);
      alert('Message sent successfully!');
      this.reset();
    });
  }

  // Product Page
  if (path.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = getProductById(productId);
    if (product) {
      const gallery = document.getElementById('imageGallery');
      product.images.forEach((img, i) => {
        gallery.innerHTML += `
          <img src="${img}" alt="Image ${i + 1}" 
               onclick="document.getElementById('mainMedia').src = this.src; 
                        document.getElementById('mainMedia').style.display = 'block'; 
                        document.getElementById('mainVideo').style.display = 'none'; 
                        this.parentElement.querySelectorAll('img, video').forEach(el => el.classList.remove('active')); 
                        this.classList.add('active')" 
               ${i === 0 ? 'class="active"' : ''}>
        `;
      });
      if (product.video) {
        gallery.innerHTML += `
          <video src="${product.video}" muted 
                 onclick="document.getElementById('mainVideo').src = this.src; 
                          document.getElementById('mainVideo').style.display = 'block'; 
                          document.getElementById('mainMedia').style.display = 'none'; 
                          this.parentElement.querySelectorAll('img, video').forEach(el => el.classList.remove('active')); 
                          this.classList.add('active')">
          </video>
        `;
      }

      document.getElementById('mainMedia').src = product.images[0];
      if (product.video) document.getElementById('mainVideo').src = product.video;

      document.getElementById('productDetails').innerHTML = `
        <h1>${product.name}</h1>
        <p class="price">₹${product.price}</p>
        <p>${product.description}</p>
        <div class="payment-options">
          <button class="buy-now" onclick="buyNow('${product.id}', '${product.name}', ${product.price})">Buy Now</button>
          <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
      `;
    } else {
      document.getElementById('productDetails').innerHTML = '<p>Product not found.</p>';
    }
  }

  // Admin Page
  if (path.includes('admin.html')) {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        link.classList.add('active');
        document.getElementById(link.getAttribute('data-section')).classList.add('active');
      });
    });
    navLinks[0].classList.add('active');
    sections[0].classList.add('active');

    document.getElementById('productForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const product = {
        id: Date.now().toString(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        images: [
          document.getElementById('image1').value || 'https://via.placeholder.com/200',
          document.getElementById('image2').value || 'https://via.placeholder.com/200',
          document.getElementById('image3').value || 'https://via.placeholder.com/200'
        ],
        video: document.getElementById('video').value || null
      };
      const newProducts = getProducts();
      newProducts.push(product);
      saveProducts(newProducts);
      console.log('New Product Added:', product); // Log for manual update
      alert('Product added! To make it permanent, copy the console log and update products.json, then push to GitHub.');
      this.reset();
      loadProductsSection();
    });

    function loadProductsSection() {
      const productList = document.getElementById('productsSection').querySelector('.product-list');
      const products = getProducts();
      productList.innerHTML = '';
      products.forEach(product => {
        productList.innerHTML += `
          <div class="product-list-item">
            <span>${product.name} - ₹${product.price}</span>
            <button class="delete-button" onclick="deleteProduct('${product.id}'); loadProductsSection();">Delete</button>
          </div>
        `;
      });
    }

    function loadOrdersSection() {
      const ordersList = document.getElementById('ordersSection');
      const orders = getOrders();
      ordersList.innerHTML = orders.map(o => `
        <div class="order-item">
          <p>Order ID: ${o.id}</p>
          <p>Products: ${o.productIds.map(id => getProductById(id)?.name || 'Unknown').join(', ')}</p>
          <p>Total Amount: ₹${o.totalAmount}</p>
          <p>Date: ${o.date}</p>
        </div>
      `).join('') || '<p>No orders yet.</p>';
    }

    function loadMessagesSection() {
      const messagesList = document.getElementById('messagesSection');
      const messages = getMessages();
      messagesList.innerHTML = messages.map(m => `
        <div class="message-item">
          <p>${m.text} - ${m.timestamp}</p>
          <a href="mailto:muhammadsafvans313@gmail.com?subject=Message from Website&body=${encodeURIComponent(m.text)}" target="_blank">Send to Email</a>
        </div>
      `).join('') || '<p>No messages yet.</p>';
    }

    loadProductsSection();
    loadOrdersSection();
    loadMessagesSection();
  }
});

// Payment Simulation
function buyNow(productId, productName, amount) {
  recordOrder([productId], amount);
  alert(`Payment of ₹${amount} for ${productName} processed to 8921386159 via GPay/PhonePe. Thank you!`);
}

function addToCart(productId) {
  let newCart = getCart();
  newCart.push(productId);
  saveCart(newCart);
  alert('Product added to cart!');
}

window.deleteProduct = deleteProduct; // Expose globally