import React from 'react';
import { ImSpinner2 } from "react-icons/im";


const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-orange-600 bg-white min-h-[500px]">
      <ImSpinner2 className="animate-spin text-5xl mb-4" />
      <p className="text-xl font-semibold text-gray-700">İçerik Yükleniyor...</p>
      <p className="text-sm text-gray-500">Lütfen bekleyiniz.</p>
    </div>
  );
};

export default LoadingSpinner;