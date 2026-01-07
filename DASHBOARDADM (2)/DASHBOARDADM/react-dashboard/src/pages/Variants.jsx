import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const Variants = () => {
    const { variants, types, categories, addVariant, deleteVariant } = useData();

    // Form State
    const [formData, setFormData] = useState({
        name: '', category: '', type: '', size: '', color: '', colorCode: '#000000', stock: '', price: ''
    });

    const [filter, setFilter] = useState({ category: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, category, type, size, color, stock, price } = formData;
        if (!name || !category || !type || !size || !color || !stock || !price) {
            return alert('Mohon lengkapi semua field!');
        }
        addVariant(formData);
        setFormData({ name: '', category: '', type: '', size: '', color: '', colorCode: '#000000', stock: '', price: '' });
        alert('Varian produk berhasil ditambahkan.');
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus varian ini?')) {
            deleteVariant(id);
        }
    };

    // Filter Logic
    const filteredVariants = variants.filter(v => {
        return (filter.category === '' || v.category === filter.category) &&
            (filter.type === '' || v.type === filter.type);
    });

    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Varian Produk</h2>
                <p>Kelola varian produk (ukuran, warna, stok)</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Tambah Varian Baru</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Produk</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Produk Lengkap" />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Kategori</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="">Pilih Kategori</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Jenis Produk</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="">Pilih Jenis</option>
                                {types.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Ukuran</label>
                            <select name="size" value={formData.size} onChange={handleChange}>
                                <option value="">Pilih Size</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                                <option value="All Size">All Size</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Nama Warna</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Contoh: Navy" />
                        </div>
                        <div className="form-group">
                            <label>Kode Warna (Preview)</label>
                            <input type="color" name="colorCode" value={formData.colorCode} onChange={handleChange} style={{ height: '50px', padding: '5px' }} />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Stok</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" />
                        </div>
                        <div className="form-group">
                            <label>Harga (Rp)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">Tambah Varian</button>
                </form>
            </div>

            <div className="filter-section">
                <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
                    <option value="">Semua Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                    <option value="">Semua Jenis</option>
                    {types.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <button onClick={() => setFilter({ category: '', type: '' })}>Reset Filter</button>
            </div>

            <div className="variant-list">
                {filteredVariants.map(v => (
                    <div key={v.id} className="variant-item">
                        <div className="variant-badges">
                            <span className="variant-badge badge-kategori"><i className="fas fa-tag"></i> {v.category}</span>
                            <span className="variant-badge badge-jenis"><i className="fas fa-box"></i> {v.type}</span>
                        </div>
                        <h3>{v.name}</h3>
                        <p><strong>Size:</strong> {v.size}</p>
                        <p><strong>Warna:</strong> <span className="color-preview" style={{ background: v.colorCode }}></span> {v.color}</p>
                        <p><strong>Stok:</strong> {v.stock} pcs</p>
                        <p><strong>Harga:</strong> Rp {parseInt(v.price).toLocaleString('id-ID')}</p>
                        <div className="action-btns">
                            <button className="btn-edit" onClick={() => alert('Fitur Edit belum tersedia')}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(v.id)}>Hapus</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Variants;
