import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Pengaturan</h2>
                <p>Sesuaikan preferensi aplikasi</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Tampilan</h2>
                </div>

                <div style={{ padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Mode Gelap</h3>
                        <p style={{ fontSize: '14px', color: '#777' }}>Aktifkan tampilan mode gelap untuk kenyamanan mata</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="btn-primary"
                        style={{ background: isDark ? 'var(--secondary)' : 'var(--dark)' }}
                    >
                        {isDark ? 'Matikan' : 'Aktifkan'}
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Reset Data</h2>
                </div>
                <p style={{ marginBottom: '15px' }}>Hapus semua data tersimpan di browser ini.</p>
                <button
                    className="btn-delete"
                    onClick={() => {
                        if (window.confirm('Hapus semua data lokal?')) {
                            localStorage.removeItem('dashboardData');
                            window.location.reload();
                        }
                    }}
                >
                    Reset Data Aplikasi
                </button>
            </div>
        </div>
    );
};

export default Settings;
