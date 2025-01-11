import { useState, useEffect } from "react";
import axios from "axios";

export const useStockSearch = (symbol, setSymbol) => {
  const [availableStocks, setAvailableStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const API_KEY = process.env.REACT_APP_API_KEY;

        // Ensure the API key exists
        if (!API_KEY) {
          console.error("API key is missing in the environment variables.");
          return;
        }

        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/stock/list?apikey=${API_KEY}`
        );
        const stocks = response.data
          .filter((stock) => stock.symbol && stock.name)
          .map((stock) => ({
            symbol: stock.symbol,
            name: stock.name,
          }));
        setAvailableStocks(stocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setAvailableStocks([]);
      }
    };
    fetchStocks();
  }, []);

  const handleSymbolChange = (value) => {
    setSymbol(value);
    setHighlightedIndex(-1);

    if (value.length > 0) {
      const matches = availableStocks.filter(
        (stock) =>
          stock.symbol?.toLowerCase().startsWith(value.toLowerCase()) ||
          stock.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(matches.slice(0, 10));
    } else {
      setFilteredStocks([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredStocks.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setSymbol(filteredStocks[highlightedIndex]?.symbol || "");
      setFilteredStocks([]);
      e.preventDefault();
    }
  };

  const handleSelect = (stock) => {
    setSymbol(stock.symbol);
    setFilteredStocks([]);
  };

  return {
    filteredStocks,
    highlightedIndex,
    handleSymbolChange,
    handleKeyDown,
    handleSelect,
  };
};
