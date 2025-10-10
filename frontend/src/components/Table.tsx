import React from 'react';

interface TableProps {
  data: any[];
  columns: string[];
}

const Table: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="py-2 px-4 border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="py-2 px-4 border-b">{row[col] || ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
