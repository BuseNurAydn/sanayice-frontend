import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../services/cartService';
import { addToFavorites, removeFavorites, fetchFavorites } from "../services/favoritesService";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.cart);
  // Sepete ekleme sırasında butonu disable etmek için state
  const [adding, setAdding] = useState(false);

  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.productId === product.id);


  // Add Favorites
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    if (!token) {
      // Giriş yoksa, sadece ürün id'sini string olarak sakla
      localStorage.setItem("pendingFavoriteItem", product.id.toString());
      toast.info("Lütfen giriş yapın!");
      navigate("/auth/login");
      return;
    }
    setAdding(true);
    try {
      if (isFavorite) {
        await dispatch(removeFavorites(product.id)).unwrap();
        toast.success('Favorilerden çıkarıldı');
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        toast.success('Favorilere eklendi!');
      }
      await dispatch(fetchFavorites()).unwrap();
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setAdding(false);
    }
  };

  //sepete ekleme sayfasına
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    // Eğer kullanıcı giriş yapmamışsa
    if (!token) {
      // Ürünü localStorage'a geçici olarak kaydet
      localStorage.setItem(
        "pendingCartItem",
        JSON.stringify({ productId: product.id, quantity: 1 })
      );
      toast.info("Lütfen giriş yapın!");
      navigate("/auth/login");
      return;
    }
    setAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success("Ürün sepete eklendi");
    } catch (err) {
      toast.error(err?.message || "Bir hata oluştu.");
    } finally {
      setAdding(false);
    }
  };

  //detay sayfasına gitme
  const handleClick = () => {
    navigate(`/product/${product.id}`);
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
        onClick={handleFavoriteClick}
      >
        {isFavorite ? (
          <FaHeart className="text-orange-500" />
        ) : (
          <FaRegHeart className="text-gray-400 hover:text-orange-500" />
        )}
      </button>

      <div className="relative mb-3">
        <div className="h-32 w-full rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {product.additionalImages ? (
            <img src={product.additionalImages[0]} alt={product.name} className="h-full object-contain" />
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
        disabled={adding}
        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={handleAddToCart}
      >
        {adding ? "Ekleniyor..." : "Sepete Ekle"}
      </button>
    </div>
  );
};
export default ProductCard;

