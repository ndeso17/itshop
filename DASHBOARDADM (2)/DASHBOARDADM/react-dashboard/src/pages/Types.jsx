import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const Types = () => {
    const { types, addType, deleteType } = useData();
    const [typeName, setTypeName] = useState('');
    const [typeIcon, setTypeIcon] = useState('fa-box');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!typeName) return alert('Mohon isi nama jenis!');
        addType(typeName, typeIcon);
        setTypeName('');
        alert('Jenis produk berhasil ditambahkan.');
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jenis ini?')) {
            deleteType(id);
        }
    };

    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Jenis Produk</h2>
                <p>Kelola jenis produk yang tersedia</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Tambah Jenis Baru</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Jenis</label>
                        <input
                            type="text"
                            name="typeName"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                            placeholder="Contoh: Jaket, Kaos..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Icon Class (Font Awesome)</label>
                        <input
                            type="text"
                            name="typeIcon"
                            value={typeIcon}
                            onChange={(e) => setTypeIcon(e.target.value)}
                            placeholder="fa-box"
                        />
                        <small style={{ display: 'block', marginTop: '5px', color: '#777' }}>
                            Contoh: fa-tshirt, fa-socks, fa-hat-cowboy
                        </small>
                    </div>
                    <button type="submit" className="btn-primary">Tambah Jenis</button>
                </form>
            </div>

            <div className="variant-list">
                {types.map(type => (
                    <div key={type.id} className="variant-item">
                        <div style={{ fontSize: '24px', color: 'var(--accent)', marginBottom: '10px' }}>
                            <i className={`fas ${type.icon}`}></i>
                        </div>
                        <h3>{type.name}</h3>
                        <p>Total Produk: {type.count || 0}</p>
                        <div className="action-btns" style={{ marginTop: '15px' }}>
                            <button className="btn-delete" onClick={() => handleDelete(type.id)}>Hapus</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Types;
