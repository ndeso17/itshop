// Mock Product Data
const products = [
    {
        id: 1,
        name: "Premium jacket",
        price: 150000,
        category: "Men",
        image: "JAKET.jpg",
        rating: 4.8,
        reviews: 124
    },
    {
        id: 2,
        name: "Tshirt",
        price: 120000,
        category: "Men",
        image: "kaos.jpg",
        rating: 4.5,
        reviews: 89
    },
    {
        id: 3,
        name: "Atasan Wanita",
        price: 850000,
        category: "Women",
        image: "KAOSWM.jpg",
        rating: 4.9,
        reviews: 215
    },
    {
        id: 4,
        name: "Atasan Wanita",
        price: 95000,
        category: "Women",
        image: "ATSWM.jpg",
        rating: 4.7,
        reviews: 67
    },
    {
        id: 5,
        name: "One Set Kids",
        price: 450000,
        category: "Kids",
        image: "KIsDSS.jpg",
        rating: 4.6,
        reviews: 142
    },
    {
        id: 6,
        name: "Baby One set",
        price: 2300000,
        category: "Baby",
        image: "babyyy.jpg",
        rating: 4.8,
        reviews: 88
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Format Currency
const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Update Header Badges
const updateBadges = () => {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
};

// Render Products
const renderProducts = () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatIDR(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem" onclick="goToDetail(${product.id})">Detail</button>
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-add" onclick="toggleWishlist(${product.id})" style="margin-left:5px; background: ${wishlist.includes(product.id) ? 'var(--light)' : ''}; color: ${wishlist.includes(product.id) ? 'var(--secondary)' : 'inherit'}">
                         <i class="${wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};

// Add to Cart
const addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateBadges();

    // Simple toast notification
    alert(`${product.name} added to cart!`);
};

// Toggle Wishlist
const toggleWishlist = (id) => {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
        alert('Added to wishlist');
    } else {
        wishlist.splice(index, 1);
        alert('Removed from wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderProducts(); // Re-render to update icon
};

// Go to Detail
const goToDetail = (id) => {
    localStorage.setItem('currentProduct', id);
    window.location.href = 'product-detail.html';
};

// Render Cart (for cart.html)
const renderCart = () => {
    const cartContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div>
                <h4>${item.name}</h4>
                <p>${formatIDR(item.price)}</p>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateQty(${item.id}, -1)" class="btn-secondary" style="padding: 2px 8px;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty(${item.id}, 1)" class="btn-secondary" style="padding: 2px 8px;">+</button>
                    <button onclick="removeFromCart(${item.id})" style="color: var(--gray); border: none; background: none; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.textContent = formatIDR(total);
    if (totalEl) totalEl.textContent = formatIDR(total);
};

window.updateQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateBadges();
};

window.removeFromCart = (id) => {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateBadges();
};

// Render Checkout (for checkout.html)
const renderCheckout = () => {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');

    if (!checkoutItems) return;

    checkoutItems.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatIDR(item.price * item.quantity)}</span>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (checkoutTotal) checkoutTotal.textContent = formatIDR(total);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBadges();

    if (document.getElementById('product-grid')) {
        renderProducts();
    }

    if (document.getElementById('cart-items')) {
        renderCart();
    }

    if (document.getElementById('checkout-items')) {
        renderCheckout();
    }

    // Detail page logic
    if (window.location.pathname.includes('product-detail.html')) {
        const productId = localStorage.getItem('currentProduct');
        const product = products.find(p => p.id == productId);
        if (product) {
            document.getElementById('detail-img').src = product.image;
            document.getElementById('detail-name').textContent = product.name;
            document.getElementById('detail-price').textContent = formatIDR(product.price);
            document.getElementById('detail-category').textContent = product.category;
            document.getElementById('add-to-cart-btn').onclick = () => addToCart(product.id);
        }
    }
});
