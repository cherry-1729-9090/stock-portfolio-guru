import axiosInstance from "./axiosInstance.js";

// Get a specific stock by ID
export const getStock = async (symbol) => {
    console.log('Fetching stock:', symbol);
    try {
        const response = await axiosInstance.get(`/stocks/get/symbol/${symbol}`);
        console.log('Stock data received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock:', error);
        throw error.response?.data || { message: "Failed to fetch stock" };
    }
};

// Create a new stock
export const createStock = async (symbol, quantity, purchasePrice) => {
    console.log('Creating stock:', { symbol, quantity, purchasePrice });
    try {
        const response = await axiosInstance.post('/stocks/create', {
            symbol,
            quantity: Number(quantity),
            purchasePrice: Number(purchasePrice)
        });
        console.log('Stock created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating stock:', error);
        throw error.response?.data || { message: "Failed to create stock" };
    }
};

// Update a stock by ID
export const updateStock = async (symbol, stockData) => {
    try {
        const response = await axiosInstance.put(`/stocks/update/symbol/${symbol}`, {
            ...stockData,
            quantity: Number(stockData.quantity),
            purchasePrice: Number(stockData.purchasePrice)
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update stock" };
    }
};

// Delete a stock by ID
export const deleteStock = async (symbol) => {
    try {
        const response = await axiosInstance.delete(`/stocks/delete/symbol/${symbol}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete stock" };
    }
};