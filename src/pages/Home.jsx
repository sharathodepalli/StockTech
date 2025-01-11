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
        if (!API_KEY) {
          console.error("API Key is missing in the environment variables.");
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

  return {
    availableStocks,
    filteredStocks,
    highlightedIndex,
    setFilteredStocks,
    setHighlightedIndex,
  };
};
