import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const ProductCard = ({ product, showDiscount = false }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavorite = () => setIsFavorited(!isFavorited);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  //detay sayfasına gitme
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  //sepete ekleme sayfasına
  const handleAdd = (e) => {
    e.stopPropagation();          // karta tıklama tetiklenmesin
    dispatch(addToCart(product)); // redux
    toast.success("Ürün sepete eklendi! 🎉");
  };
  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 min-w-[220px] max-h-[360px] flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer relative group"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
    >
      {/* Favori ikonu */}
      <button
        className="bg-gray-50 p-2 rounded-full z-10 absolute top-2 right-2 text-gray-400 hover:text-orange-500"
        onClick={toggleFavorite}
      >
        <FaRegHeart className={`h-5 w-5 ${isFavorited ? " text-orange-500" : ""}`} />
      </button>

      <div className="relative mb-3">
        <div className="h-32 w-full rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full object-contain" />
          ) : (
            <span className="text-gray-400 text-sm">Ürün Görseli</span>
          )}
        </div>
        {/* ...badge ve diğerleri aynı */}
      </div>
      <h1 className="font-semibold text-gray-800 flex-1">{product.name}</h1>
      <p className="text-sm mb-2">{product.brand}</p>
      <div className="flex flex-col gap-1 mb-3">
        {product.oldPrice && (
          <span className="text-gray-400 line-through text-sm">₺{product.oldPrice.toLocaleString()}</span>
        )}
        <span className="text-orange-600 font-bold text-lg">₺{product.price.toLocaleString()}</span>
      </div>
      <button
        className="mt-3 w-full bg-orange-500 hover:bg-orange-500 text-white py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={handleAdd}>
        Sepete Ekle
      </button>
    </div>
  );
};
export default ProductCard;

