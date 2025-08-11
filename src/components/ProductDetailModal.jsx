import React from "react";
import { BsXLg } from "react-icons/bs";

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-none z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-6 right-6 text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={onClose}
        >
          <BsXLg className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4">Ürün Detayı</h3>

        <div className="flex flex-col items-center">
          <img
            src={product.imageUrls?.[0]}
            alt={product.productName}
            className="w-32 h-32 object-cover rounded mb-4"
          />
          <p className="text-sm font-medium">Ürün Adı: {product.productName}</p>
          <p className="text-sm text-gray-600">Marka: {product.productBrand}</p>
          <p className="text-sm text-gray-600">Model: {product.productModel}</p>
          <p className="text-sm text-gray-600">Adet: {product.quantity}</p>
          <p className="text-sm text-gray-600 font-semibold">
            Fiyat:{" "}
            {product.totalPrice.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
