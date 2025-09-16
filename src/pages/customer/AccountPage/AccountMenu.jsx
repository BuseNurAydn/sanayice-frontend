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
    localStorage.removeItem("pendingFavoriteItem"); 
    localStorage.removeItem("pendingCartItem");
    dispatch(clear());
    dispatch(clearFavorites());
    dispatch(logout());
    setOpen(false);
    navigate('/');
  };

  if (!user) {
    return (
      <button
        className="md:bg-black md:hover:bg-gray-800 text-white md:px-4 md:py-2 rounded-xl font-semibold transition-colors duration-200  transform hover:scale-105  cursor-pointer flex flex-row gap-x-2 items-center"
        onClick={() => navigate("/giris-kaydol/giris-yap")}>
       <FaUser className="text-lg text-orange-600 md:text-white w-4 h-4" />
      <span className="hidden md:inline">Giriş / Kayıt Ol</span>
      </button>
    );
  }

  return (
    <div className="relative z-20"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      >
      <Link to="/hesabim" onClick={toggleMenu}  className="md:bg-[var(--color-dark-blue)] rounded-lg md:px-4 md:py-2 text-white transition-colors duration-200 transform hover:scale-105 cursor-pointer flex flex-row gap-x-2 items-center">
       <FaUser className="text-lg text-orange-600 md:text-white w-4 h-4" />
      <span className="hidden md:inline-block">Hesabım</span>
      </Link>

      {open && (
        <div className="absolute right-0 top-full w-48 bg-white border border-gray-200 shadow-lg rounded p-4 z-50">
          <p className="text-md text-[var(--color-dark-orange)] break-words text-center">{user.name}</p>
          <hr className="my-2" />
          <div className='text-sm '>
            <Link to="/hesabim/profilim" className="py-1 hover:text-orange-600 flex flex-row gap-x-4 items-center" onClick={() => setOpen(false)}>
            <BsBasket3/>
            Profil Bilgilerim
          </Link>
          <Link to="/hesabim/siparislerim" className="py-1 hover:text-orange-600 flex flex-row gap-x-4 items-center" onClick={() => setOpen(false)}>
            <BsBasket3/>
            Tüm Siparişlerim
          </Link>
          <Link to="/hesabim/adreslerim" className="py-1 hover:text-orange-600 flex flex-row gap-x-4 items-center" onClick={() => setOpen(false)}>
            <RiCoupon3Line />
            Adres Bilgilerim
          </Link>
          <Link to="/hesabim/degerlendirmelerim" className=" flex flex-row gap-x-4 items-center py-1 hover:text-orange-600" onClick={() => setOpen(false)}>
            <FaRegUser/>
            Değerlendirmelerim
          </Link>
           <Link to="/hesabim/takip-edilenler" className=" flex flex-row gap-x-4 items-center py-1 hover:text-orange-600" onClick={() => setOpen(false)}>
            <FaRegUser/>
            Takip Edilenler
          </Link>
          <Link to="/hesabim/destek-sikayet" className=" flex flex-row gap-x-4 items-center py-1 hover:text-orange-600" onClick={() => setOpen(false)}>
            <BsChatSquareDots />
            Destek ve Şikayet
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
