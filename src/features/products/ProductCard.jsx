// src/features/products/ProductCard.jsx
import React, { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";


const ProductCard = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  return (
    <div className="relative bg-white rounded-xl shadow p-4 hover:shadow-lg transition group">
      {/* Favori ikonu */}
      <button
        className="bg-gray-100 p-2 rounded-full absolute top-2 right-2 text-gray-400 hover:text-orange-500"
        onClick={toggleFavorite}
      >
        <HeartIcon className={`h-6 w-6 ${isFavorited ? "fill-orange-500 text-orange-500" : ""}`} />
      </button>

      {/* Ürün resmi */}
      <img src={product.image} alt={product.name} className="w-full h-48 object-contain rounded mb-3"/>

      {/* Marka */}
      <p className="text-sm text-gray-500 font-medium">{product.brand}</p>

      {/* Açıklama */}
      <h2 className="text-md font-semibold text-gray-800 mt-1">{product.name}</h2>

      {/* Fiyat */}
      <p className="text-blue-600 font-bold mt-2 text-lg">{product.price.toFixed(2)} TL</p>

       {/* Sepete Ekle - sadece hover’da gözükecek */}
      <button className="mt-3 w-full bg-orange-500 hover:bg-orange-500 text-white py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Sepete Ekle
      </button>
    </div>
  );
};

export default ProductCard;
