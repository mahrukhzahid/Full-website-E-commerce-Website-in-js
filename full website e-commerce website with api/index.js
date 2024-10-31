function welcomeAlert() {
  Swal.fire({
      icon: 'info',
      title: 'Hey there! 👋',
      text: 'Welcome to a new shopping experience!',
      footer: `<a href='Login.html' style="text-decoration: none; color: #3085d6;">Login to your account</a>`,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#4CAF50',
      showCloseButton: true,
      timer: 7000,
      backdrop: `rgba(0,0,123,0.4) left top no-repeat`
  });
}

function openNav() {
  document.getElementById("sideMenu").style.width = "300px";
}

function closeNav() {
  document.getElementById("sideMenu").style.width = "0";
}

function toggleCart() {
  const cart = document.getElementById("sideCart");
  cart.style.width = cart.style.width === "0px" ? "300px" : "0";
}

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch products from the API
fetch('https://dummyjson.com/products?limit=100')
  .then(res => res.json())
  .then(data => {
      allProducts = data.products || [];
      displayProducts(currentPage);
      setupPagination(allProducts);
      updateCart();
  })
  .catch(error => console.error('Error fetching data:', error));

function displayProducts(page) {
  const productsContainer = document.getElementById('products-cards');
  productsContainer.innerHTML = '';
  const start = (page - 1) * itemsPerPage;
  const paginatedProducts = allProducts.slice(start, start + itemsPerPage);

  paginatedProducts.forEach(product => {
      const card = `
          <div class="card">
              <img src="${product.thumbnail}" alt="${product.title}">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">$${product.price}</p>
              <button class="btn-color" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
      `;
      productsContainer.innerHTML += card;
  });
}

function setupPagination(products) {
  const paginationContainer = document.getElementById('pagination');
  const totalPages = Math.ceil(products.length / itemsPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.classList.add('page-button');
      pageButton.addEventListener('click', () => {
          currentPage = i;
          displayProducts(currentPage);
          updateActivePage();
      });
      paginationContainer.appendChild(pageButton);
  }
  updateActivePage();
}

function updateActivePage() {
  const pageButtons = document.querySelectorAll('.page-button');
  pageButtons.forEach((button, index) => {
      button.classList.toggle('active', index + 1 === currentPage);
  });
}

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
      const existingProduct = cart.find(item => item.id === productId);
      if (existingProduct) {
          existingProduct.quantity++;
      } else {
          cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
      Swal.fire({
          title: 'Added to Cart',
          text: `${product.title} has been added to your cart!`,
          icon: 'success',
          confirmButtonText: 'Okay'
      });
  }
}

function updateCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalDiv = document.getElementById('cart-total');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
      const cartItem = `
          <div>
              ${item.title} - $${item.price} x ${item.quantity} 
              <button onclick="removeFromCart(${item.id})">Remove</button>
          </div>
      `;
      cartItemsDiv.innerHTML += cartItem;
      total += item.price * item.quantity;
  });

  cartTotalDiv.textContent = `Total: $${total.toFixed(2)}`;
  document.getElementById('cart-count').textContent = cart.length;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
  Swal.fire({
      title: 'Removed from Cart',
      text: 'Item has been removed from your cart!',
      icon: 'info',
      confirmButtonText: 'Okay'
  });
}

function checkout() {
  if (cart.length === 0) {
      Swal.fire({
          title: 'Cart Empty',
          text: 'Please add items to your cart before checking out!',
          icon: 'warning',
          confirmButtonText: 'Okay'
      });
  } else {
      // Implement checkout process here
      Swal.fire({
          title: 'Checkout Successful',
          text: 'Thank you for your purchase!',
          icon: 'success',
          confirmButtonText: 'Continue Shopping'
      });
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
      toggleCart(); // Close the cart sidebar after checkout
  }
}
