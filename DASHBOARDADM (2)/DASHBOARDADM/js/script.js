```javascript
// Dark mode detection
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

let pendingDeleteElement = null;
let pendingDeleteType = null;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function showModal(title, message, isSuccess = true) {
    const modal = document.getElementById('modalOverlay');
    const icon = document.getElementById('modalIcon');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;

    icon.className = 'modal-icon ' + (isSuccess ? 'success' : 'warning');
    icon.innerHTML = isSuccess ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation-triangle"></i>';

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function showConfirmModal(message, element, type) {
    pendingDeleteElement = element;
    pendingDeleteType = type;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    pendingDeleteElement = null;
    pendingDeleteType = null;
    pendingDeleteId = null; // Clear pending ID as well
}

function deletePromo(btn) {
    showConfirmModal('Apakah Anda yakin ingin menonaktifkan promo ini?', btn, 'promo');
}

function showComingSoon() {
    showModal('Coming Soon', 'Fitur ini akan segera tersedia!', true);
}

// ------------------------------------------------------------------
// DATA PERSISTENCE & STATE MANAGEMENT
// ------------------------------------------------------------------

// Default Data if Storage is empty
const defaultData = {
    types: [
        { id: 1, name: 'Jaket', icon: 'fa-vest-patches', count: 12 },
        { id: 2, name: 'Kaos', icon: 'fa-tshirt', count: 45 },
        { id: 3, name: 'Kemeja', icon: 'fa-tshirt', count: 28 },
        { id: 4, name: 'Celana', icon: 'fa-socks', count: 30 }
    ],
    categories: [
        { id: 1, name: 'Pria', icon: 'fa-male', count: 35 },
        { id: 2, name: 'Wanita', icon: 'fa-female', count: 42 },
        { id: 3, name: 'Anak-anak', icon: 'fa-child', count: 18 },
        { id: 4, name: 'Unisex', icon: 'fa-venus-mars', count: 25 }
    ]
};

let appState = {
    types: [],
    categories: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Check which page we are on and render accordingly
    if (document.getElementById('typesList')) {
        renderTypes();
    }
    if (document.getElementById('categoriesList')) {
        renderCategories();
    }
    
    // Init charts if dashboard
    if (typeof initDashboardCharts === 'function') {
        initDashboardCharts();
    }
});

function loadState() {
    const stored = localStorage.getItem('dashboardData');
    if (stored) {
        appState = JSON.parse(stored);
    } else {
        appState = JSON.parse(JSON.stringify(defaultData)); // Deep copy
        saveState();
    }
}

function saveState() {
    localStorage.setItem('dashboardData', JSON.stringify(appState));
}

// ---- TYPES LOGIC ----

function renderTypes() {
    const list = document.getElementById('typesList');
    if (!list) return;

    list.innerHTML = '';
    appState.types.forEach(type => {
        const item = document.createElement('div');
        item.className = 'variant-item type-item';
        item.dataset.id = type.id;
        item.innerHTML = `
    < div style = "font-size: 24px; color: var(--accent); margin-bottom: 10px;" >
        <i class="fas ${type.icon}"></i>
            </div >
            <h3>${type.name}</h3>
            <p>Total Produk: ${type.count}</p>
            <div class="action-btns" style="margin-top: 15px;">
                <button class="btn-delete" onclick="deleteType(this, ${type.id})">Hapus</button>
            </div>
`;
        list.appendChild(item);
    });
}

function addType() {
    const name = document.getElementById('typeName').value;
    const icon = document.getElementById('typeIcon').value || 'fa-box';

    if (!name) {
        showModal('Perhatian!', 'Mohon isi nama jenis!', false);
        return;
    }

    const newType = {
        id: Date.now(),
        name: name,
        icon: icon,
        count: 0
    };

    appState.types.push(newType);
    saveState();
    renderTypes();
    
    showModal('Berhasil!', 'Jenis produk berhasil ditambahkan.');
    document.getElementById('typeName').value = '';
}

function deleteType(btn, id) {
    // Pass ID to delete function if available, otherwise just UI ref
    pendingDeleteId = id; 
    showConfirmModal('Apakah Anda yakin ingin menghapus jenis ini?', btn, 'type');
}

// ---- CATEGORIES LOGIC ----

function renderCategories() {
    const list = document.getElementById('categoriesList');
    if (!list) return;

    list.innerHTML = '';
    appState.categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'variant-item category-item';
        item.dataset.id = cat.id;
        item.innerHTML = `
    < div style = "font-size: 24px; color: var(--accent); margin-bottom: 10px;" >
        <i class="fas ${cat.icon}"></i>
            </div >
            <h3>${cat.name}</h3>
            <p>Total Produk: ${cat.count}</p>
            <div class="action-btns" style="margin-top: 15px;">
                <button class="btn-delete" onclick="deleteCategory(this, ${cat.id})">Hapus</button>
            </div>
`;
        list.appendChild(item);
    });
}

function addCategory() {
    const name = document.getElementById('categoryName').value;
    const icon = document.getElementById('categoryIcon').value || 'fa-tag';

    if (!name) {
        showModal('Perhatian!', 'Mohon isi nama kategori!', false);
        return;
    }

    const newCat = {
        id: Date.now(),
        name: name,
        icon: icon,
        count: 0
    };

    appState.categories.push(newCat);
    saveState();
    renderCategories();
    
    showModal('Berhasil!', 'Kategori berhasil ditambahkan.');
    document.getElementById('categoryName').value = '';
}

function deleteCategory(btn, id) {
    pendingDeleteId = id;
    showConfirmModal('Apakah Anda yakin ingin menghapus kategori ini?', btn, 'category');
}

// ---- SHARED CONFIRM ACTION ----

let pendingDeleteId = null; // Store ID for logic deletion

function confirmAction() {
    if (pendingDeleteElement) {
        // UI Removal (Optional if we re-render, but nice for animation)
        // logic removal
        if (pendingDeleteType === 'type') {
            appState.types = appState.types.filter(t => t.id !== pendingDeleteId);
            saveState();
            renderTypes();
        } else if (pendingDeleteType === 'category') {
            appState.categories = appState.categories.filter(c => c.id !== pendingDeleteId);
            saveState();
            renderCategories();
        } else if (pendingDeleteType === 'variant') {
            pendingDeleteElement.closest('.variant-item').remove();
        } else if (pendingDeleteType === 'promo') {
            pendingDeleteElement.closest('.promo-card').remove();
        }
    }
    closeConfirmModal();
    showModal('Berhasil!', 'Item berhasil dihapus.');
    pendingDeleteId = null;
}

function deleteVariant(btn) {
    showConfirmModal('Apakah Anda yakin ingin menghapus varian ini?', btn, 'variant');
}

function deletePromo(btn) {
    showConfirmModal('Apakah Anda yakin ingin menonaktifkan promo ini?', btn, 'promo');
}

function showComingSoon() {
    showModal('Coming Soon', 'Fitur ini akan segera tersedia!', true);
}

// Logic for Variants Page
function filterVariants() {
    const category = document.getElementById('filterCategory').value;
    const type = document.getElementById('filterType').value;
    const items = document.querySelectorAll('.variant-item');

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemType = item.getAttribute('data-type');

        let show = true;
        if (category && itemCategory !== category) show = false;
        if (type && itemType !== type) show = false;

        item.style.display = show ? 'block' : 'none';
    });
}

function resetFilters() {
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterType').value = '';
    filterVariants();
}

function getCategoryIcon(category) {
    const icons = {
        'Pria': 'fa-male',
        'Wanita': 'fa-female',
        'Anak-anak': 'fa-child',
        'Unisex': 'fa-venus-mars'
    };
    return icons[category] || 'fa-tag';
}

function getTypeIcon(type) {
    const icons = {
        'Jaket': 'fa-vest-patches',
        'Kaos': 'fa-tshirt',
        'Kemeja': 'fa-tshirt',
        'Celana': 'fa-socks',
        'Rok': 'fa-plus',
        'Topi': 'fa-hat-cowboy',
        'Sepatu': 'fa-shoe-prints',
        'Dress': 'fa-vest',
        'Sweater': 'fa-mitten',
        'Aksesoris': 'fa-gem'
    };
    return icons[type] || 'fa-box';
}

function addVariant() {
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const type = document.getElementById('productType').value;
    const size = document.getElementById('productSize').value;
    const color = document.getElementById('productColor').value;
    const colorCode = document.getElementById('productColorCode').value;
    const stock = document.getElementById('productStock').value;
    const price = document.getElementById('productPrice').value;

    if (!name || !category || !type || !size || !color || !stock || !price) {
        showModal('Perhatian!', 'Mohon lengkapi semua field!', false);
        return;
    }

    // In a real app, this would send data to server
    // Here we just mock adding it to the DOM
    const list = document.getElementById('variantList');
    const newItem = document.createElement('div');
    newItem.className = 'variant-item';
    newItem.setAttribute('data-category', category);
    newItem.setAttribute('data-type', type);

    // Format price
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    newItem.innerHTML = `
    < div class="variant-badges" >
            <span class="variant-badge badge-kategori"><i class="fas ${getCategoryIcon(category)}"></i> ${category}</span>
            <span class="variant-badge badge-jenis"><i class="fas ${getTypeIcon(type)}"></i> ${type}</span>
        </div >
        <h3>${name}</h3>
        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Warna:</strong> <span class="color-preview" style="background: ${colorCode};"></span> ${color}</p>
        <p><strong>Stok:</strong> ${stock} pcs</p>
        <p><strong>Harga:</strong> ${formattedPrice}</p>
        <div class="action-btns">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete" onclick="deleteVariant(this)">Hapus</button>
        </div>
`;

    list.insertBefore(newItem, list.firstChild);
    showModal('Berhasil!', 'Varian produk berhasil ditambahkan.');

    // Reset form
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productType').value = '';
    document.getElementById('productSize').value = '';
    document.getElementById('productColor').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productPrice').value = '';
}

// Logic for Promo Page
function addPromo() {
    const name = document.getElementById('promoName').value;
    if (!name) {
        showModal('Perhatian!', 'Mohon lengkapi nama promo!', false);
        return;
    }
    showModal('Berhasil!', 'Promo berhasil dibuat (Simulasi).');
}

// Logic for Dashboard Charts
function initDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    // Line Chart: Income Trend
    const ctxTrend = document.getElementById('incomeTrendChart');
    if (ctxTrend) {
        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                datasets: [{
                    label: 'Pemasukan (Juta Rp)',
                    data: [65, 59, 80, 81, 56, 95, 85, 90, 110, 105, 120, 150],
                    borderColor: '#8fa3a0', // Accent
                    backgroundColor: 'rgba(143, 163, 160, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#8fa3a0',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Pie Chart: Income vs Expense
    const ctxPie = document.getElementById('incomeExpenseChart');
    if (ctxPie) {
        new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Pemasukan', 'Pengeluaran'],
                datasets: [{
                    data: [64, 36], // percentages
                    backgroundColor: [
                        '#8fa3a0', // Accent
                        '#c48f7a'  // Primary
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
}
