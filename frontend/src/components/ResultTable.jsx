import React from 'react';

const ResultTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-sm">暂无数据</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="w-full max-w-full overflow-x-auto border border-gray-600 rounded-lg max-h-64 overflow-y-auto">
      <table className="w-full divide-y divide-gray-600 text-sm">
        <thead className="bg-gray-700 sticky top-0 z-10">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-700 transition">
              {columns.map(col => (
                <td key={col} className="px-4 py-2 text-gray-300 break-words">
                  {row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;