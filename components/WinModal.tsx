
import React from 'react';

interface WinModalProps {
  onReset: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ onReset }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 text-center border-2 border-yellow-400 max-w-sm w-full">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4">تهانينا!</h2>
        <p className="text-xl text-gray-200 mb-8">لقد نجحت في الوصول إلى الهدف بتعاون رائع!</p>
        <button
          onClick={onReset}
          className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-bold text-lg transition-transform transform hover:scale-105"
        >
          اللعب مرة أخرى
        </button>
      </div>
    </div>
  );
};

export default WinModal;
