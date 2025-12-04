import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProductView from './pages/ProductView';
import RegulatorDashboard from './pages/RegulatorDashboard';
import { useWeb3 } from './context/Web3Context';

function App() {
  const { loading } = useWeb3();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<ProductView />} />
            <Route path="/regulator" element={<RegulatorDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
