// toggle sidebar start
function welcomeAlert() {
    Swal.fire({
      icon: 'info',  // Sets the icon type
      title: 'Hey there! 👋',
      text: 'Welcome to a new shopping experience!',
      footer: `<a href='Login.html' style="text-decoration: none; color: #3085d6;">Login to your account</a>`,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#4CAF50',  // Custom button color
      showCloseButton: true,  // Adds a close button on the top-right
      timer: 7000,  // Auto-closes after 7 seconds
      backdrop: `rgba(0,0,123,0.4) left top no-repeat`
    });
  }
  
function openNav() {
    document.getElementById("sideMenu")
        .style.width = "300px";
    document.getElementById("contentArea")
        .style.marginLeft = "300px";
}

function closeNav() {
    document.getElementById("sideMenu")
        .style.width = "0";
    document.getElementById("contentArea")
        .style.marginLeft = "0";
}

function showContent(content) {
    document.getElementById("contentTitle")
        .textContent = content + " page";
        
    closeNav();
}




// toggle sidebar end


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
        updateCartCount();
    })
    .catch(error => console.error('Error fetching data:', error));

// Display paginated products
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

// Set up pagination
function setupPagination(products) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(products.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayProducts(currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }
}

// Update cart display
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = `
            <div>
                <h6>${item.title}</h6>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartContainer.innerHTML += cartItem;
    });
    document.getElementById('cart-total').innerText = `Total: $${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
    // const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = `Cart: ${cartCount} items`;
}

// Add product to cart
// Add product to cart
function addToCart(productId) {
    const product = allProducts.find(product => product.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart(); // Update cart display
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(); // Update cart count
        Swal.fire({
            title: 'Added to Cart!',
            icon: 'success',
            timer: 1000
        });
    }
}

// Remove product from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    Swal.fire({
        title: 'Removed from Cart!',
        icon: 'info',
        timer: 1000
    });
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        Swal.fire({
            title: 'Your cart is empty!',
            icon: 'info',
            timer: 1000
        });
    } else {
        Swal.fire({
            title: 'Checkout successful!',
            icon: 'success',
            timer: 1000
        });
        cart = [];
        updateCart();
        updateCartCount();
        localStorage.removeItem('cart');
    }
}



document.getElementById("checkoutButton").addEventListener("click", checkout);
/* login form start */

  











/* login form end */
