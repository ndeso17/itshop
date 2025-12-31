import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1>{t('common.profile') || 'My Profile'}</h1>
            <div className="profile-card" style={{
                marginTop: '20px',
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '8px',
                maxWidth: '500px'
            }}>
                <div style={{ marginBottom: '15px' }}>
                    <strong>Name:</strong> {user?.full_name || 'N/A'}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <strong>Email:</strong> {user?.email || 'N/A'}
                </div>

                <button
                    onClick={logout}
                    className="btn btn-secondary"
                    style={{ marginTop: '20px' }}
                >
                    {t('common.logout') || 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
