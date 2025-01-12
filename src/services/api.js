import axios from "axios";

const fetchFilteredData = async (filters, setLoading, setData, setError) => {
  setLoading(true);
  try {
    // Validate filters
    if (!filters.symbol || !filters.type || !filters.period) {
      throw new Error("Required filters are missing.");
    }

    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const response = await axios.get(`${API_URL}/filter-data`, {
      params: {
        symbol: filters.symbol,
        type: filters.type,
        period: filters.period,
        start_year: filters.dateRange.start,
        end_year: filters.dateRange.end,
        min_revenue: filters.revenueRange.min,
        max_revenue: filters.revenueRange.max,
        min_net_income: filters.netIncomeRange.min,
        max_net_income: filters.netIncomeRange.max,
      },
    });

    console.log("API Response:", response.data);
    setData(response.data); // Update state with fetched data
  } catch (error) {
    if (error.response) {
      console.error("Backend returned an error:", error.response.data);
      setError("Backend error occurred.");
    } else if (error.request) {
      console.error("No response received from backend:", error.request);
      setError("No response from backend.");
    } else {
      console.error("Error setting up request:", error.message);
      setError("An error occurred while setting up the request.");
    }
  } finally {
    setLoading(false);
  }
};
