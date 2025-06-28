import Logo from '../../assets/png/Logo2.png'
import { BsBellFill } from "react-icons/bs";
import { FaUser, FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const iconStyle = 'bg-[var(--color-orange)] px-2 py-1'
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);


  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <header className='bg-[var(--color-light)] p-2 pl-10 md:pl-4 flex justify-between'>
      <Link to={user?.role === "ROLE_SELLER" ? '/seller/dashboard' : '/seller/seller-verification'}>
        <img src={Logo} alt="Logo" className="cursor-pointer" />
      </Link>
      <div className="flex items-center space-x-3 pr-4">
        <Link to="#" className={iconStyle}><BsBellFill /></Link>

        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className={iconStyle + ' flex items-center gap-2 cursor-pointer'}>
            <FaUser />
          </button>

          {open && (
            <div className="absolute right-0 top-full w-48 bg-white border border-gray-200 shadow-lg rounded p-4 z-50">
              <p className="text-center text-[var(--color-dark-orange)] font-medium">{user.name}</p>
              <hr className="my-2" />
              <div className="text-sm space-y-2">
                <Link to="/seller/seller_profile" className="flex flex-row gap-x-4 items-center py-1 hover:text-orange-600">
                  <FaRegUser />
                  Profilim
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex flex-row gap-x-4 items-center py-1 text-sm hover:text-orange-600 cursor-pointer"
                  type='button'
                >
                  <LuLogOut />
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header;
