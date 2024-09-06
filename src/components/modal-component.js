import React from 'react';

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 transform transition-all">
        {children}
        
      </div>
    </div>
  );
};

export default Modal;
