import axiosInstance from "./axiosInstancejs";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/users/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const checkAuth = async () => {
  try {
    const response = await axiosInstance.get("/users/check-auth");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Authentication check failed" };
  }
};
