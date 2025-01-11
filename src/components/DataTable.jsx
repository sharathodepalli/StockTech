const DataTable = ({ data, onSort, sortKey, sortOrder }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
  <th className="p-2 text-left">
    <button
      onClick={() => onSort("date")}
      className="underline text-blue-500 hover:text-blue-700"
    >
      Date {sortKey === "date" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </th>
  <th className="p-2 text-right">
    <button
      onClick={() => onSort("revenue")}
      className="underline text-blue-500 hover:text-blue-700"
    >
      Revenue {sortKey === "revenue" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </th>
  <th className="p-2 text-right">
    <button
      onClick={() => onSort("netIncome")}
      className="underline text-blue-500 hover:text-blue-700"
    >
      Net Income {sortKey === "netIncome" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </th>
  <th className="p-2 text-right">
    <button
      onClick={() => onSort("grossProfit")}
      className="underline text-blue-500 hover:text-blue-700"
    >
      Gross Profit {sortKey === "grossProfit" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </th>
  <th className="p-2 text-right">
    <button
      onClick={() => onSort("eps")}
      className="underline text-blue-500 hover:text-blue-700"
    >
      EPS {sortKey === "eps" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </th>
  <th className="p-2 text-right">
    <button
      onClick={() => onSort("operatingIncome")}
      className="underline text-blue-500 hover:text-blue-700"
    >
      Operating Income {sortKey === "operatingIncome" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </th>
</tr>

        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2 text-left">{row.date || "N/A"}</td>
              <td className="p-2 text-right">{row.revenue || "N/A"}</td>
              <td className="p-2 text-right">{row.netIncome || "N/A"}</td>
              <td className="p-2 text-right">{row.grossProfit || "N/A"}</td>
              <td className="p-2 text-right">{row.eps || "N/A"}</td>
              <td className="p-2 text-right">{row.operatingIncome || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
