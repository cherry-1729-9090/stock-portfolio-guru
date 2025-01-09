import axiosInstance from "./axiosInstancejs";

// Get a specific stock by ID
export const getStock = async (id) => {
  try {
    const response = await axiosInstance.get(`/stocks/get/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch stock" };
  }
};

// Create a new stock
export const createStock = async (stockData) => {
  try {
    const response = await axiosInstance.post('/stocks/create', stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create stock" };
  }
};

// Update a stock by ID
export const updateStock = async (id, stockData) => {
  try {
    const response = await axiosInstance.put(`/stocks/update/${id}`, stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update stock" };
  }
};

// Delete a stock by ID
export const deleteStock = async (id) => {
  try {
    const response = await axiosInstance.delete(`/stocks/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete stock" };
  }
};