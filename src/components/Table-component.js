import React from 'react';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const TableComponent = ({ columns, data, currentPage, totalPages, handlePageChange, arrowsStyles, handleInputChange }) => {

  const handleKeyDown = (e, rowIndex, columnKey) => {
    const { key } = e;

    if (key === 'ArrowDown') {
      e.preventDefault();
      const nextRowIndex = rowIndex + 1;
      if (data[nextRowIndex]) {
        const nextInput = document.querySelector(`#input-${data[nextRowIndex].id}-${columnKey}`);
        if (nextInput) nextInput.focus();
      }
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      const prevRowIndex = rowIndex - 1;
      if (data[prevRowIndex]) {
        const prevInput = document.querySelector(`#input-${data[prevRowIndex].id}-${columnKey}`);
        if (prevInput) prevInput.focus();
      }
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      const nextColumnIndex = columns.findIndex(col => col.key === columnKey) + 1;
      if (columns[nextColumnIndex]) {
        const nextInput = document.querySelector(`#input-${data[rowIndex].id}-${columns[nextColumnIndex].key}`);
        if (nextInput) nextInput.focus();
      }
    } else if (key === 'ArrowLeft') {
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
      <table className="min-w-full bg-white dark:bg-transparent border border-gray-300 shadow-md rounded-xl">
        <thead className="bg-aqua bg-yellow-800">
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                key={column.key}
                className="text-white py-3 px-4 border-b font-semibold text-sm text-center tooltip"
                title={column.header}
                style={{ borderRight: columnIndex < columns.length - 1 ? '1px solid white' : 'none' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`bg-blue-950 transition-colors duration-200 ease-in-out`}
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.key}
                    className={`py-3 px-4 border-b text-sm text-center ${columnIndex !== 0 ? 'text-black' : 'text-gray-100'}  font-bold `}
                    style={{ borderRight: columnIndex < columns.length - 1 ? '1px solid white' : 'none' }}
                  >
                    {columnIndex === 0 ? (
                      row[column.key] || 'N/A'
                    ) : (
                      <input
                        id={`input-${row.id}-${column.key}`}
                        type="text"
                        className="w-min text-center bg-slate-200 py-1"
                        value={row[column.key]}
                        onChange={(e) => handleInputChange(row.id, column.key, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, column.key)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr key="no-data">
              <td colSpan={columns.length} className="py-3 px-4">
                <span className="text-center block text-gray-500">No data to be shown</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            title="Previous page"
            className={`${
              arrowsStyles ||
              'text-2xl rounded-full flex items-center justify-center w-10 h-10 focus:outline-none hover:bg-yellow-300 disabled:cursor-not-allowed'
            } bg-yellow-500 text-white`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <MdOutlineKeyboardArrowLeft />
          </button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            title="Next page"
            className={`${
              arrowsStyles ||
              'text-2xl rounded-full flex items-center justify-center w-10 h-10 focus:outline-none hover:bg-yellow-300 disabled:cursor-not-allowed'
            } bg-yellow-500 text-white`}
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <MdOutlineKeyboardArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
