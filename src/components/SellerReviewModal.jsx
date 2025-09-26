import React from 'react';
import { FaStar } from 'react-icons/fa';

const SellerReviewModal = ({ seller, rating, setRating, comment, setComment, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        {/* Başlık ve Kapat Butonu */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">Satıcıyı Değerlendir</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>

        <div className="h-0.5 bg-gray-200 w-full my-6"/>

        {/* Satıcı Bilgisi */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={seller.profileImage || "https://via.placeholder.com/60"}
            alt={seller.name}
            className="w-16 h-16 object-cover rounded-full border border-gray-200"
          />
          <div>
            <h3 className="text-lg font-bold">{seller.sellerCompanyName}</h3>
          </div>
        </div>

        {/* Yıldız Puanlama */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700 font-medium">Lütfen Satıcıyı Puanlayın:</span>
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
          placeholder="Satıcı hakkında yorumunuzu yazın..."
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
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerReviewModal;
