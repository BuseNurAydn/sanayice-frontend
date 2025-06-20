import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import Logo from "../../src/assets/png/Logo2.png";
import { FaShoppingCart } from "react-icons/fa";
import AccountMenu from "../pages/customer/AccountPage/AccountMenu";
import { useEffect } from 'react'
import { fetchCart, addToCart } from "../services/cartService";
import { toast } from "react-toastify"
import { fetchFavorites, addToFavorites } from "../services/favoritesService";

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteItems = useSelector(state => state.favorites.items);
  const favoriteCount = favoriteItems.length;
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  useEffect(() => {
    dispatch(fetchFavorites()); //kullanıcının çıkış yaptıktan sonra sepette ve favorilerde ürünü varsa yüklensin
    dispatch(fetchCart());
  }, [dispatch]);

  //bekleyen sepete ve favorilere eklenmek istenen ürünü çektim
  useEffect(() => {
    const pendingCartItem = localStorage.getItem("pendingCartItem");
    const pendingFavoriteItem = localStorage.getItem("pendingFavoriteItem");

    if (pendingCartItem) {
      const item = JSON.parse(pendingCartItem);
      dispatch(addToCart(item))
        .unwrap()
        .then(() => {
          toast.success("Ürün sepete eklendi");
          localStorage.removeItem("pendingCartItem");
          dispatch(fetchCart());
        });
    }
    if (pendingFavoriteItem) {
      const productId = Number(pendingFavoriteItem);
      dispatch(addToFavorites(productId))
        .unwrap()
        .then(() => {
          toast.success("Ürün favorilere eklendi");
          localStorage.removeItem("pendingFavoriteItem");
          dispatch(fetchFavorites());
        })
    }
  }, []);

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-30">
      <div className="container mx-auto px-0 2xl:px-30 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="rounded-lg object-contain cursor-pointer"
            onClick={() => navigate('/')} />
        </div>

        <div className="flex-1 max-w-2xl mx-6">
          <div className="relative">
            <input
              className="w-full border border-gray-200 rounded-xl px-5 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
              placeholder="Ürün, kategori veya marka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors duration-200">
            <svg width={20} height={20} fill="none" stroke="currentColor" className="text-gray-700">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="2" />
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
              <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="2" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>

          {/* Favoriler Butonu */}
          <button
            className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors duration-200"
            onClick={() => navigate("/favorite")}
          >
            <svg width={20} height={20} fill="none" stroke="currentColor" className="text-gray-700">
              <path
                d="M10 18l-1.45-1.32C4.4 12.36 2 10.28 2 7.5 2 5.42 3.42 4 5.5 4c1.54 0 3.04 1.04 3.57 2.36h1.87C13.46 5.04 14.96 4 16.5 4 18.58 4 20 5.42 20 7.5c0 2.78-2.4 4.86-6.55 9.18L10 18z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate('/cart')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 transform hover:scale-105 relative flex flex-row space-x-2">
            <FaShoppingCart size={24} className="mr-2" /> Sepetim
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </button>
          <div> <AccountMenu /> </div>
        </div>
      </div>
    </header>
  );
};

export default Header;