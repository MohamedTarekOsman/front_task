import React from 'react';

const TableComponent = ({ columns, data, currentPage, totalPages, handlePageChange, arrowsStyles, handleInputChange }) => {

  const handleKeyDown = (e, rowIndex, columnKey) => {
    const { key } = e;

    if (key === 'ArrowRight') {
      e.preventDefault();
      const nextRowIndex = rowIndex + 1;
      if (data[nextRowIndex]) {
        const nextInput = document.querySelector(`#input-${data[nextRowIndex].id}-${columnKey}`);
        if (nextInput) nextInput.focus();
      }
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      const prevRowIndex = rowIndex - 1;
      if (data[prevRowIndex]) {
        const prevInput = document.querySelector(`#input-${data[prevRowIndex].id}-${columnKey}`);
        if (prevInput) prevInput.focus();
      }
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      const nextColumnIndex = columns.findIndex(col => col.key === columnKey) + 1;
      if (columns[nextColumnIndex]) {
        const nextInput = document.querySelector(`#input-${data[rowIndex].id}-${columns[nextColumnIndex].key}`);
        if (nextInput) nextInput.focus();
      }
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      const prevColumnIndex = columns.findIndex(col => col.key === columnKey) - 1;
      if (columns[prevColumnIndex]) {
        const prevInput = document.querySelector(`#input-${data[rowIndex].id}-${columns[prevColumnIndex].key}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  return (
    <div className="overflow-x-auto text">
    <table className="min-w-full bg-blue-950 border border-gray-300 shadow-md rounded-xl">
      <thead className="bg-yellow-800">
        <tr>
          <th className="text-white py-3 px-4 border-b font-semibold text-sm text-center">Name</th>
          {data.map((row, rowIndex) => (
            <th
              key={rowIndex}
              className="text-white py-3 px-4 border-b font-semibold text-sm text-center"
            >
              {row.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {columns.map((column, columnIndex) => (
          <>
          {column.key === 'name' ?"":
          <tr key={columnIndex}>
          <td className="py-3 px-4 border-b text-sm text-center text-white font-bold">{column.header}</td>
          {data.map((row, rowIndex) => (
            
            <td
              key={rowIndex}
              className="py-3 px-4 border-b text-sm text-center"
            >
                <input
                  id={`input-${row.id}-${column.key}`}
                  type="text"
                  className="w-min text-center bg-slate-200 py-1 font-bold"
                  value={row[column.key]}
                  onChange={(e) => handleInputChange(row.id, column.key, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, column.key)}
                />
            </td>
          ))}
        </tr>
          }
          
          </>
        ))}
      </tbody>
    </table>

    {totalPages > 1 && (
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages).keys()].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              className={`w-10 h-10 text-center rounded-full ${
                currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    )}
  </div>
  );
};

export default TableComponent;
