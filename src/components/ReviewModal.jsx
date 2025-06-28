import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({ product, rating, setRating, comment, setComment, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-none flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        {/* Kapat butonu */}
        <div className='flex justify-between'>
         <h2 className='font-semibold text-xl'>Ürünü Nasıl Buldunuz?</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div  className='h-0.5 bg-gray-200 w-full my-6'/>
        {/* Ürün bilgileri */}
        <div className="flex gap-4 mb-6">
          <img
            src={product.additionalImages?.[0] || "https://via.placeholder.com/100"}
            alt={product.productName}
            className="w-24 h-24 object-cover rounded"
          />
          <div>
            <h2 className="text-lg font-bold">{product.productName}</h2>
            <p className="text-sm text-gray-600">Marka: {product.productBrand}</p>
          </div>
        </div>

        {/* Yıldız Puanlama */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700 font-medium">Lütfen Ürünü Puanlayın:</span>
          {[...Array(5)].map((_, i) => {
            const value = i + 1;
            return (
              <FaStar
                key={value}
                onClick={() => setRating(value)}
                className="cursor-pointer"
                color={value <= rating ? "#FFA500" : "#E5E7EB"}
                size={30}
              />
            );
          })}
        </div>

        {/* Yorum alanı */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Yorumunuzu yazın..."
        />

        {/* Butonlar */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
          >
            İptal
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 rounded bg-orange-600 text-white hover:bg-orange-700"
          >
            Yorum Yap
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReviewModal;
