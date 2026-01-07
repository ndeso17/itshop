import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

const defaultData = {
    types: [
        { id: 1, name: 'Jaket', icon: 'fa-vest-patches', count: 12 },
        { id: 2, name: 'Kaos', icon: 'fa-tshirt', count: 45 },
        { id: 3, name: 'Kemeja', icon: 'fa-tshirt', count: 28 },
        { id: 4, name: 'Celana', icon: 'fa-socks', count: 30 }
    ],
    categories: [
        { id: 1, name: 'Pria', icon: 'fa-male', count: 35 },
        { id: 2, name: 'Wanita', icon: 'fa-female', count: 42 },
        { id: 3, name: 'Anak-anak', icon: 'fa-child', count: 18 },
        { id: 4, name: 'Unisex', icon: 'fa-venus-mars', count: 25 }
    ],
    variants: [
        { id: 101, name: 'Jaket Bomber Premium', category: 'Pria', type: 'Jaket', size: 'L', color: 'Navy', colorCode: '#000080', stock: 50, price: 350000 },
        { id: 102, name: 'Kaos Polos Cotton', category: 'Unisex', type: 'Kaos', size: 'M', color: 'Putih', colorCode: '#ffffff', stock: 100, price: 75000 },
        { id: 103, name: 'Kemeja Flannel', category: 'Pria', type: 'Kemeja', size: 'XL', color: 'Merah Kotak', colorCode: '#800000', stock: 30, price: 180000 }
    ]
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        const stored = localStorage.getItem('dashboardData');
        return stored ? JSON.parse(stored) : defaultData;
    });

    useEffect(() => {
        localStorage.setItem('dashboardData', JSON.stringify(data));
    }, [data]);

    const addType = (name, icon = 'fa-box') => {
        const newType = {
            id: Date.now(),
            name,
            icon,
            count: 0
        };
        setData(prev => ({ ...prev, types: [...prev.types, newType] }));
        return true;
    };

    const deleteType = (id) => {
        setData(prev => ({
            ...prev,
            types: prev.types.filter(t => t.id !== id)
        }));
    };

    const addCategory = (name, icon = 'fa-tag') => {
        const newCat = {
            id: Date.now(),
            name,
            icon,
            count: 0
        };
        setData(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
        return true;
    };

    const deleteCategory = (id) => {
        setData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== id)
        }));
    };

    const addVariant = (variant) => {
        const newVariant = { ...variant, id: Date.now() };
        setData(prev => ({ ...prev, variants: [newVariant, ...prev.variants] }));
        return true;
    };

    const deleteVariant = (id) => {
        setData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    return (
        <DataContext.Provider value={{
            types: data.types,
            categories: data.categories,
            variants: data.variants || [], // ensure array
            addType,
            deleteType,
            addCategory,
            deleteCategory,
            addVariant,
            deleteVariant
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
