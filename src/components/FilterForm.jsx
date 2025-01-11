import React, { useState } from "react";
import axios from "axios";
import DataTable from "./DataTable";

const FilterForm = () => {
  const [filters, setFilters] = useState({
    symbol: "",
    type: "income-statement",
    period: "annual",
    dateRange: { start: "2020", end: "2024" },
    revenueRange: { min: 0, max: 500000000000 },
    netIncomeRange: { min: 0, max: 100000000000 },
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchFilteredData = async () => {
    setLoading(true);
    setError("");
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      const params = {
        symbol: filters.symbol,
        type: filters.type,
        period: filters.period,
        start_year: parseInt(filters.dateRange.start, 10),
        end_year: parseInt(filters.dateRange.end, 10),
        min_revenue: filters.revenueRange.min,
        max_revenue: filters.revenueRange.max,
        min_net_income: filters.netIncomeRange.min,
        max_net_income: filters.netIncomeRange.max,
      };

      const response = await axios.get(`${API_BASE_URL}/filter-data`, { params });

      setData(response.data); // Set the raw data
      setFilteredData(response.data); // Set the filtered data initially to the fetched data
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = data.filter((row) => {
      const withinDateRange =
        parseInt(row.date.split("-")[0], 10) >= parseInt(filters.dateRange.start, 10) &&
        parseInt(row.date.split("-")[0], 10) <= parseInt(filters.dateRange.end, 10);
      const withinRevenueRange =
        row.revenue >= filters.revenueRange.min && row.revenue <= filters.revenueRange.max;
      const withinNetIncomeRange =
        row.netIncome >= filters.netIncomeRange.min &&
        row.netIncome <= filters.netIncomeRange.max;

      return withinDateRange && withinRevenueRange && withinNetIncomeRange;
    });

    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc"; // Toggle sort order
    setSortKey(key);
    setSortOrder(order);

    const sorted = [...filteredData].sort((a, b) => {
      if (key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      return order === "asc" ? a[key] - b[key] : b[key] - a[key];
    });

    setFilteredData(sorted);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Financial Filter Form</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">Symbol:</label>
          <input
            type="text"
            value={filters.symbol}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                symbol: e.target.value,
              }))
            }
            className="w-full p-2 border rounded text-black"
            placeholder="Enter Stock Symbol (e.g., AAPL)"
          />
        </div>
        <div>
          <label className="block mb-1">Start Year:</label>
          <input
            type="number"
            value={filters.dateRange.start}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value },
              }))
            }
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1">End Year:</label>
          <input
            type="number"
            value={filters.dateRange.end}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value },
              }))
            }
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1">Revenue Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.revenueRange.min}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                revenueRange: { ...prev.revenueRange, min: e.target.value },
              }))
            }
            className="w-full p-2 border rounded text-black"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.revenueRange.max}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                revenueRange: { ...prev.revenueRange, max: e.target.value },
              }))
            }
            className="w-full p-2 border rounded mt-1 text-black"
          />
        </div>
        <div>
          <label className="block mb-1">Net Income Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.netIncomeRange.min}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                netIncomeRange: { ...prev.netIncomeRange, min: e.target.value },
              }))
            }
            className="w-full p-2 border rounded text-black"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.netIncomeRange.max}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                netIncomeRange: { ...prev.netIncomeRange, max: e.target.value },
              }))
            }
            className="w-full p-2 border rounded mt-1 text-black"
          />
        </div>
      </div>
      <button
        onClick={fetchFilteredData}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4 ml-4"
      >
        Apply Filters
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {filteredData && (
        <DataTable
          data={filteredData}
          onSort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default FilterForm;
