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
let pendingDeleteId = null;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function showModal(title, message, isSuccess = true) {
    const modal = document.getElementById('modalOverlay');
    if (!modal) return;
    const icon = document.getElementById('modalIcon');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;

    icon.className = 'modal-icon ' + (isSuccess ? 'success' : 'warning');
    icon.innerHTML = isSuccess ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation-triangle"></i>';

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) modal.classList.remove('active');
}

function showConfirmModal(message, element, type) {
    pendingDeleteElement = element;
    pendingDeleteType = type;
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        document.getElementById('confirmMessage').textContent = message;
        confirmModal.classList.add('active');
    }
}

function closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) confirmModal.classList.remove('active');
    pendingDeleteElement = null;
    pendingDeleteType = null;
    pendingDeleteId = null;
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

document.addEventListener('DOMContentLoaded', () => {
    loadState();

    if (document.getElementById('typesList')) {
        renderTypes();
    }
    if (document.getElementById('categoriesList')) {
        renderCategories();
    }

    if (typeof initDashboardCharts === 'function') {
        initDashboardCharts();
    }
});

function loadState() {
    const stored = localStorage.getItem('dashboardData');
    if (stored) {
        appState = JSON.parse(stored);
    } else {
        appState = JSON.parse(JSON.stringify(defaultData));
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
            <div style="font-size: 24px; color: var(--accent); margin-bottom: 10px;">
                <i class="fas ${type.icon}"></i>
            </div>
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
    const nameEl = document.getElementById('typeName');
    const iconEl = document.getElementById('typeIcon');
    if (!nameEl) return;

    const name = nameEl.value;
    const icon = iconEl ? iconEl.value || 'fa-box' : 'fa-box';

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
    nameEl.value = '';
}

function deleteType(btn, id) {
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
            <div style="font-size: 24px; color: var(--accent); margin-bottom: 10px;">
                <i class="fas ${cat.icon}"></i>
            </div>
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
    const nameEl = document.getElementById('categoryName');
    const iconEl = document.getElementById('categoryIcon');
    if (!nameEl) return;

    const name = nameEl.value;
    const icon = iconEl ? iconEl.value || 'fa-tag' : 'fa-tag';

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
    nameEl.value = '';
}

function deleteCategory(btn, id) {
    pendingDeleteId = id;
    showConfirmModal('Apakah Anda yakin ingin menghapus kategori ini?', btn, 'category');
}

// ---- SHARED CONFIRM ACTION ----

function confirmAction() {
    if (pendingDeleteElement || pendingDeleteId) {
        if (pendingDeleteType === 'type') {
            appState.types = appState.types.filter(t => t.id !== pendingDeleteId);
            saveState();
            renderTypes();
        } else if (pendingDeleteType === 'category') {
            appState.categories = appState.categories.filter(c => c.id !== pendingDeleteId);
            saveState();
            renderCategories();
        } else if (pendingDeleteType === 'variant') {
            if (pendingDeleteElement) pendingDeleteElement.closest('.variant-item').remove();
        } else if (pendingDeleteType === 'promo') {
            if (pendingDeleteElement) pendingDeleteElement.closest('.promo-card').remove();
        }
    }
    closeConfirmModal();
    showModal('Berhasil!', 'Item berhasil dihapus.');
}

function deleteVariant(btn) {
    showConfirmModal('Apakah Anda yakin ingin menghapus varian ini?', btn, 'variant');
}

// ---- VARIANTS LOGIC ----

function filterVariants() {
    const categoryEl = document.getElementById('filterCategory');
    const typeEl = document.getElementById('filterType');
    if (!categoryEl || !typeEl) return;

    const category = categoryEl.value;
    const type = typeEl.value;
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
    const categoryEl = document.getElementById('filterCategory');
    const typeEl = document.getElementById('filterType');
    if (categoryEl) categoryEl.value = '';
    if (typeEl) typeEl.value = '';
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
    const fields = ['productName', 'productCategory', 'productType', 'productSize', 'productColor', 'productColorCode', 'productStock', 'productPrice'];
    const data = {};
    let valid = true;

    fields.forEach(f => {
        const el = document.getElementById(f);
        if (el) {
            data[f] = el.value;
            if (!el.value && f !== 'productColorCode') valid = false;
        }
    });

    if (!valid) {
        showModal('Perhatian!', 'Mohon lengkapi semua field!', false);
        return;
    }

    const list = document.getElementById('variantList');
    if (!list) return;

    const newItem = document.createElement('div');
    newItem.className = 'variant-item';
    newItem.setAttribute('data-category', data.productCategory);
    newItem.setAttribute('data-type', data.productType);

    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.productPrice);

    newItem.innerHTML = `
        <div class="variant-badges">
            <span class="variant-badge badge-kategori"><i class="fas ${getCategoryIcon(data.productCategory)}"></i> ${data.productCategory}</span>
            <span class="variant-badge badge-jenis"><i class="fas ${getTypeIcon(data.productType)}"></i> ${data.productType}</span>
        </div>
        <h3>${data.productName}</h3>
        <p><strong>Size:</strong> ${data.productSize}</p>
        <p><strong>Warna:</strong> <span class="color-preview" style="background: ${data.productColorCode};"></span> ${data.productColor}</p>
        <p><strong>Stok:</strong> ${data.productStock} pcs</p>
        <p><strong>Harga:</strong> ${formattedPrice}</p>
        <div class="action-btns">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete" onclick="deleteVariant(this)">Hapus</button>
        </div>
    `;

    list.insertBefore(newItem, list.firstChild);
    showModal('Berhasil!', 'Varian produk berhasil ditambahkan.');

    fields.forEach(f => {
        const el = document.getElementById(f);
        if (el && f !== 'productColorCode') el.value = '';
    });
}

// ---- PROMO LOGIC ----
function addPromo() {
    const nameEl = document.getElementById('promoName');
    if (!nameEl || !nameEl.value) {
        showModal('Perhatian!', 'Mohon lengkapi nama promo!', false);
        return;
    }
    showModal('Berhasil!', 'Promo berhasil dibuat (Simulasi).');
}

// ---- CHARTS LOGIC ----
function initDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    const ctxTrend = document.getElementById('incomeTrendChart');
    if (ctxTrend) {
        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                datasets: [{
                    label: 'Pemasukan (Juta Rp)',
                    data: [65, 59, 80, 81, 56, 95, 85, 90, 110, 105, 120, 150],
                    borderColor: '#8fa3a0',
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const ctxPie = document.getElementById('incomeExpenseChart');
    if (ctxPie) {
        new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Pemasukan', 'Pengeluaran'],
                datasets: [{
                    data: [64, 36],
                    backgroundColor: ['#8fa3a0', '#c48f7a'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
                },
                cutout: '70%'
            }
        });
    }
}
