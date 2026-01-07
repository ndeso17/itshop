import React from 'react';

const Promo = () => {
    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Promo & Diskon</h2>
                <p>Buat kode promo untuk pelanggan</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Buat Promo Baru</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); alert('Promo berhasil dibuat!'); }}>
                    <div className="form-group">
                        <label>Nama Promo</label>
                        <input type="text" placeholder="Contoh: Diskon Harbolnas" required />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Kode Promo</label>
                            <input type="text" placeholder="HARBOLNAS1212" style={{ textTransform: 'uppercase' }} required />
                        </div>
                        <div className="form-group">
                            <label>Persentase Diskon (%)</label>
                            <input type="number" placeholder="10" min="1" max="100" />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Buat Promo</button>
                </form>
            </div>

            <h3 style={{ marginBottom: '20px', color: 'var(--dark)' }}>Promo Aktif</h3>

            <div className="promo-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3>Flash Sale 12.12</h3>
                        <p>Diskon spesial untuk semua item fashion pria.</p>
                        <span className="promo-code">FS1212</span>
                        <p><small>Berlaku hingga: 15 Des 2024</small></p>
                    </div>
                    <button className="btn-delete" onClick={() => alert('Promo dinonaktifkan')}>Nonaktifkan</button>
                </div>
            </div>

            <div className="promo-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3>Gratis Ongkir Akhir Tahun</h3>
                        <p>Minimal belanja Rp 150.000</p>
                        <span className="promo-code">FREESHIP24</span>
                        <p><small>Berlaku hingga: 31 Des 2024</small></p>
                    </div>
                    <button className="btn-delete" onClick={() => alert('Promo dinonaktifkan')}>Nonaktifkan</button>
                </div>
            </div>
        </div>
    );
};

export default Promo;
