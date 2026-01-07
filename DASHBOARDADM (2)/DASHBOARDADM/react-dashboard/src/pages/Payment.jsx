import React from 'react';

const Payment = () => {
    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Pembayaran & Pengiriman</h2>
                <p>Atur metode pembayaran dan opsi pengiriman</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Metode Pembayaran</h2>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="bankTransfer" defaultChecked style={{ width: 'auto' }} />
                        <label htmlFor="bankTransfer" style={{ marginBottom: 0 }}>Transfer Bank (BCA, Mandiri, BNI)</label>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="ewallet" defaultChecked style={{ width: 'auto' }} />
                        <label htmlFor="ewallet" style={{ marginBottom: 0 }}>E-Wallet (GoPay, OVO, Dana)</label>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="cod" style={{ width: 'auto' }} />
                        <label htmlFor="cod" style={{ marginBottom: 0 }}>Cash on Delivery (COD)</label>
                    </div>
                </div>
                <button className="btn-primary" onClick={() => alert('Pengaturan tersimpan')}>Simpan Pengaturan</button>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Opsi Pengiriman</h2>
                </div>
                <div className="form-group">
                    <label>Kurir Aktif</label>
                    <select multiple style={{ height: '120px' }}>
                        <option value="jne" selected>JNE Regular</option>
                        <option value="jnt" selected>J&T Express</option>
                        <option value="sicepat" selected>SiCepat REG</option>
                        <option value="gojek">Gojek Instant</option>
                        <option value="grab">Grab Express</option>
                    </select>
                    <small style={{ display: 'block', marginTop: '5px', color: '#777' }}>Tahan CTRL untuk memilih lebih dari satu</small>
                </div>
                <button className="btn-primary" onClick={() => alert('Pengaturan tersimpan')}>Simpan Pengaturan</button>
            </div>
        </div>
    );
};

export default Payment;
