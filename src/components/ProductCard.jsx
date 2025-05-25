import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, showDiscount = false }) => {
  const navigate = useNavigate();

  // Varsayılan olarak product.id yok, varsa eklemen lazım!
  // Örnekte: id verisi olmadığı için, map'lerken id ekleyeceğiz.
  const handleCardClick = () => {
    // product.id varsa ona göre yönlendir
    if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border rounded-xl shadow-sm p-4 min-w-[220px] flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="relative mb-3">
        <div className="h-32 w-full bg-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full object-contain" />
          ) : (
            <span className="text-gray-400 text-sm">Ürün Görseli</span>
          )}
        </div>
        {/* ...badge ve diğerleri aynı */}
      </div>
      <h3 className="font-semibold text-gray-800 text-sm mb-2 flex-1">{product.name}</h3>
      <div className="flex flex-col gap-1 mb-3">
        {product.oldPrice && (
          <span className="text-gray-400 line-through text-sm">₺{product.oldPrice.toLocaleString()}</span>
        )}
        <span className="text-orange-600 font-bold text-lg">₺{product.price.toLocaleString()}</span>
      </div>
      <button
        className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
        onClick={e => e.stopPropagation()} // Sepete ekle için (detaya yönlendirmesin)
      >
        Sepete Ekle
      </button>
    </div>
  );
};

export default ProductCard;
