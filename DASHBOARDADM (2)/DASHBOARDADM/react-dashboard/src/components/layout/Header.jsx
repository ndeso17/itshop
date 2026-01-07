import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ toggleSidebar }) => {
    // We can add search logic here if needed, or keeping it static for now as per original
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <i className="fas fa-store"></i>
                <h1>Admin Dashboard</h1>
            </div>
            <div className="navbar-right">
                <div className="navbar-search">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Cari laporan..." />
                </div>
                <div className="navbar-icons">
                    <button className="navbar-icon-btn">
                        <i className="fas fa-bell"></i>
                        <span className="badge"></span>
                    </button>
                    <button className="navbar-icon-btn">
                        <i className="fas fa-envelope"></i>
                    </button>
                </div>
                <div className="navbar-profile">
                    <div className="navbar-profile-avatar">
                        <span>A</span>
                    </div>
                    <div className="navbar-profile-info">
                        <span>Admin</span>
                        <small>Administrator</small>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
