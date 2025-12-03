import React from 'react';
import ProductRegistration from '../components/ProductRegistration';
import SupplyChainActions from '../components/SupplyChainActions';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Manage your pharmaceutical supply chain operations.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProductRegistration />
                <SupplyChainActions />
            </div>
        </div>
    );
};

export default Dashboard;
