import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Types from './pages/Types';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Variants from './pages/Variants';
import Payment from './pages/Payment';
import Promo from './pages/Promo';

// Placeholder components for other pages
const Placeholder = ({ title }) => (
  <div className="content-panel active">
    <div className="page-header">
      <h2>{title}</h2>
      <p>Halaman ini sedang dalam pengembangan.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="variants" element={<Variants />} />
          <Route path="types" element={<Types />} />
          <Route path="categories" element={<Categories />} />
          <Route path="payment" element={<Payment />} />
          <Route path="promo" element={<Promo />} />
          <Route path="settings" element={<Settings />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
