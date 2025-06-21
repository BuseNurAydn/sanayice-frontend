import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import {clear} from '../../../store/cartSlice';
import { clearFavorites } from '../../../store/favoritesSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser,FaRegUser  } from "react-icons/fa";
import { BsBasket3, BsChatSquareDots } from "react-icons/bs";
import { RiCoupon3Line } from "react-icons/ri";
import { LuLogOut } from "react-icons/lu";

const AccountMenu = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pendingFavoriteItem"); // Geçici favori silinsin
    localStorage.removeItem("pendingCartItem");   // geçici sepet silinsin
    dispatch(clear());  // Sepeti temizle
    dispatch(clearFavorites()); //Favorileri temizle
    dispatch(logout());
    setOpen(false);
    navigate('/'); // çıkış sonrası anasayfaya yönlendir
  };

  if (!user) {
    return (
      <button
        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
        onClick={() => navigate("/auth/login")}>
        Giriş / Kayıt Ol
      </button>
    );
  }

  return (
    <div className="relative z-20"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      >
      <Link to="/account" onClick={toggleMenu}  className="bg-[var(--color-dark-blue)] rounded-xl px-6 py-3 text-white cursor-pointer flex flex-row gap-x-2 items-center">
       <FaUser/> Hesabım
      </Link>

      {open && (
        <div className="absolute right-0 top-full w-48 bg-white border border-gray-200 shadow-lg rounded p-4 z-50">
          <p className="text-md text-[var(--color-dark-orange)] break-words text-center">{user.name}</p>
          <hr className="my-2" />
          <div className='text-sm '>
          <Link to="/account/orders" className="py-1 hover:text-orange-600 flex flex-row gap-x-4 items-center" onClick={() => setOpen(false)}>
            <BsBasket3/>
            Tüm Siparişlerim
          </Link>
          <Link to="/coupon" className="py-1 hover:text-orange-600 flex flex-row gap-x-4 items-center" onClick={() => setOpen(false)}>
            <RiCoupon3Line />
            İndirim Kuponlarım
          </Link>
          <Link to="/profile" className=" flex flex-row gap-x-4 items-center py-1 hover:text-orange-600" onClick={() => setOpen(false)}>
            <FaRegUser/>
            Kullanıcı Bilgilerim
          </Link>
          <Link to="/evaluation" className=" flex flex-row gap-x-4 items-center py-1 hover:text-orange-600" onClick={() => setOpen(false)}>
            <BsChatSquareDots />
            Değerlendirmelerim
          </Link> 
          </div>
          <button
            onClick={handleLogout}
            className="flex flex-row gap-x-4 items-center py-1 text-sm hover:text-orange-600"
            type="button"
          > 
            <LuLogOut />
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};
export default AccountMenu;
