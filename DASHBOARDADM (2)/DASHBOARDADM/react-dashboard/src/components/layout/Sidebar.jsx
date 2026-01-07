import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <>
            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={closeSidebar}
            ></div>

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Menu Utama</div>
                    <div className="sidebar-menu">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar} // Close on mobile when clicked
                            end
                        >
                            <i className="fas fa-chart-line"></i>
                            <span>Laporan Keuangan</span>
                        </NavLink>
                        <NavLink
                            to="/variants"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-box-open"></i>
                            <span>Varian Produk</span>
                        </NavLink>
                        <NavLink
                            to="/types"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-layer-group"></i>
                            <span>Jenis Produk</span>
                        </NavLink>
                        <NavLink
                            to="/categories"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-bookmark"></i>
                            <span>Kategori</span>
                        </NavLink>
                        <NavLink
                            to="/payment"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-credit-card"></i>
                            <span>Pembayaran & Pengiriman</span>
                        </NavLink>
                        <NavLink
                            to="/promo"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-tags"></i>
                            <span>Promo & Diskon</span>
                        </NavLink>
                    </div>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Lainnya</div>
                    <div className="sidebar-menu">
                        {/* Settings could be a separate page or modal. Assuming page for now */}
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-cog"></i>
                            <span>Pengaturan</span>
                        </NavLink>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <p>Dashboard v1.0</p>
                    <button className="sidebar-footer-btn" onClick={() => alert('Logout clicked')}>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
