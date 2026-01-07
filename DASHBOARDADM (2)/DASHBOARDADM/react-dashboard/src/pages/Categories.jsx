import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const Categories = () => {
    const { categories, addCategory, deleteCategory } = useData();
    const [catName, setCatName] = useState('');
    const [catIcon, setCatIcon] = useState('fa-tag');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!catName) return alert('Mohon isi nama kategori!');
        addCategory(catName, catIcon);
        setCatName('');
        alert('Kategori berhasil ditambahkan.');
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            deleteCategory(id);
        }
    };

    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Kategori Produk</h2>
                <p>Kelola kategori target pasar</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Tambah Kategori Baru</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Kategori</label>
                        <input
                            type="text"
                            name="categoryName"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                            placeholder="Contoh: Pria, Wanita..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Icon Class (Font Awesome)</label>
                        <input
                            type="text"
                            name="categoryIcon"
                            value={catIcon}
                            onChange={(e) => setCatIcon(e.target.value)}
                            placeholder="fa-tag"
                        />
                    </div>
                    <button type="submit" className="btn-primary">Tambah Kategori</button>
                </form>
            </div>

            <div className="variant-list">
                {categories.map(cat => (
                    <div key={cat.id} className="variant-item">
                        <div style={{ fontSize: '24px', color: 'var(--accent)', marginBottom: '10px' }}>
                            <i className={`fas ${cat.icon}`}></i>
                        </div>
                        <h3>{cat.name}</h3>
                        <p>Total Produk: {cat.count || 0}</p>
                        <div className="action-btns" style={{ marginTop: '15px' }}>
                            <button className="btn-delete" onClick={() => handleDelete(cat.id)}>Hapus</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
