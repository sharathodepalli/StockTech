import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import FilterForm from "./components/FilterForm";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Environment Variables
  const THEME_KEY = process.env.REACT_APP_THEME_KEY || "theme";
  const APP_TITLE = process.env.REACT_APP_APP_TITLE || "StockTech";
  const LOGO_PATH = `${process.env.PUBLIC_URL}/${process.env.REACT_APP_LOGO || "financial-profit.png"}`;

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) || "light";
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [THEME_KEY]);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      localStorage.setItem(THEME_KEY, "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem(THEME_KEY, "light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, THEME_KEY]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 text-gray-800 dark:text-gray-100 font-roboto">
        {/* Header Section */}
        <header className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg text-white">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center gap-4">
              <img
                src={LOGO_PATH}
                alt="Logo"
                className="w-14 h-14 rounded-full border-2 border-white shadow-md"
              />
              <h1
                className="text-3xl font-bold tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {APP_TITLE}
              </h1>
            </Link>
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-full shadow hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <span>🌞</span>
                </>
              ) : (
                <>
                  <span>🌙</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-10 px-4">
          <Routes>
            <Route
              path="/"
              element={
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                  <FilterForm onFilter={(data) => console.log(data)} />
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-6">
          <div className="container mx-auto text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {APP_TITLE}. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
