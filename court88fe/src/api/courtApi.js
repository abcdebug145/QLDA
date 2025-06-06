import axiosInstance from "./axiosConfig";

export const getCourtsByDate = async (date) => {
    try {
        // Format date to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const response = await axiosInstance.get(`bookings/date?date=${formattedDate}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
