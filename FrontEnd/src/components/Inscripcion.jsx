import React, { useState } from "react";

const Inscripcion = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
        <div className="bg-white p-5 rounded-lg shadow-lg w-80 relative z-50">
          <h2 className="text-xl font-bold text-center">Inscripcion</h2>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };
  
  export default Inscripcion;
  