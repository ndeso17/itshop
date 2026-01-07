import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';

const Dashboard = () => {
    // Stats Data (Mock)
    const stats = [
        {
            title: 'Total Pemasukan',
            value: 'Rp 150.000.000',
            icon: 'fa-arrow-down',
            type: 'income' // for styling
        },
        {
            title: 'Total Pengeluaran',
            value: 'Rp 85.000.000',
            icon: 'fa-arrow-up',
            type: 'expense'
        },
        {
            title: 'Saldo Saat Ini',
            value: 'Rp 65.000.000',
            icon: 'fa-wallet',
            type: 'balance'
        }
    ];

    // Chart Data
    const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [{
            label: 'Pemasukan (Juta Rp)',
            data: [65, 59, 80, 81, 56, 95, 85, 90, 110, 105, 120, 150],
            borderColor: '#9CAFAA',
            backgroundColor: 'rgba(156, 175, 170, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#9CAFAA',
            pointBorderWidth: 2
        }]
    };

    const trendOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    const pieData = {
        labels: ['Pemasukan', 'Pengeluaran'],
        datasets: [{
            data: [64, 36],
            backgroundColor: ['#9CAFAA', '#D6A99D'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        cutout: '70%'
    };

    return (
        <div className="content-panel active">
            <div className="page-header">
                <h2>Laporan Keuangan</h2>
                <p>Ringkasan performa bisnis Anda bulan ini</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className={`stat-card stat-${stat.type}`}>
                        <div className="stat-icon">
                            <i className={`fas ${stat.icon}`}></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="card">
                    <div className="card-header">
                        <h2>Tren Pemasukan Bulanan</h2>
                    </div>
                    <div className="chart-container">
                        <Line data={trendData} options={trendOptions} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h2>Pemasukan vs Pengeluaran</h2>
                    </div>
                    <div className="chart-container" style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <div className="recent-transaction-header">
                    <h2 style={{ margin: 0 }}>Transaksi Terbaru</h2>
                    <a href="#" className="view-all-btn" onClick={(e) => { e.preventDefault(); alert('Coming Soon'); }}>Lihat Semua</a>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>22 Des 2024</td>
                            <td>Pembayaran Order #INV-2024001</td>
                            <td style={{ color: '#9CAFAA' }}>+ Rp 2.500.000</td>
                            <td><span className="status-badge status-active">Selesai</span></td>
                        </tr>
                        <tr>
                            <td>21 Des 2024</td>
                            <td>Biaya Iklan Facebook Ads</td>
                            <td style={{ color: '#D6A99D' }}>- Rp 1.200.000</td>
                            <td><span className="status-badge status-active">Selesai</span></td>
                        </tr>
                        <tr>
                            <td>21 Des 2024</td>
                            <td>Pembayaran Order #INV-2024002</td>
                            <td style={{ color: '#9CAFAA' }}>+ Rp 1.850.000</td>
                            <td><span className="status-badge status-active">Selesai</span></td>
                        </tr>
                        <tr>
                            <td>20 Des 2024</td>
                            <td>Belanja Stok Bahan Baku</td>
                            <td style={{ color: '#D6A99D' }}>- Rp 5.500.000</td>
                            <td><span className="status-badge status-pending">Pending</span></td>
                        </tr>
                        <tr>
                            <td>20 Des 2024</td>
                            <td>Pembayaran Order #INV-2024003</td>
                            <td style={{ color: '#9CAFAA' }}>+ Rp 750.000</td>
                            <td><span className="status-badge status-active">Selesai</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
