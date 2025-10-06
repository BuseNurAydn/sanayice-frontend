import sanayice from '../../assets/png/sanayice.png'
import { BsBellFill } from "react-icons/bs";
import { FaUser, FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { markAsRead, selectUserNotifications } from '../../store/notificationSlice';
import { LuLogOut } from "react-icons/lu";
import { ShoppingCart, CheckCircle, Mail, User, Package, Clock,CircleX } from 'lucide-react';

const getNotificationIcon = (text) => {
  if (text.includes("sipariş")) return { Icon: ShoppingCart, color: "text-blue-500" };
  if (text.includes("onaylandı") || text.includes("yayına alındı")) return { Icon: CheckCircle, color: "text-green-500" };
  if (text.includes("reddedildi")) return { Icon: CircleX, color: "text-purple-500" };
  if (text.includes("satıcı")) return { Icon: User, color: "text-orange-500" };
  if (text.includes("ürün")) return { Icon: Package, color: "text-indigo-500" };
  return { Icon: Clock, color: "text-gray-500" };
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user) || { role: 'ROLE_SELLER', name: 'Kullanıcı' };

  // REDUX'TAN BİLDİRİM VERİLERİNİ ÇEKME
  const { filteredNotifications, unreadCount } = useSelector(selectUserNotifications);

  // Dış Tıklama Kontrolü (Dropdown'ları kapatmak için)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconStyle = 'bg-white text-[var(--color-dark)] w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-100';
  const profileIconStyle = 'bg-[var(--color-orange)] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-shadow';


  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/', { replace: true });
  };

  // Redux'u çağırarak bildirimi okundu yapar ve yönlendirir
  const handleNotificationClick = (notif) => {
    // Sadece okunmamışsa okundu olarak işaretle
    if (!notif.isRead) {
      dispatch(markAsRead(notif.id));
    }

    setNotifOpen(false);

    // Bildirimin yönlendireceği sayfaya git (notificationSlice'daki 'link' alanı kullanılabilir)
    if (notif.link) {
      navigate(notif.link);
    } else {
      // Link yoksa varsayılan bildirimler sayfasına yönlendir
      navigate(user?.role === "ROLE_SELLER" ? "/satici/bildirimler" : "/satici/bildirimler");
    }
  };

  // Bildirim menüsünde gösterilecek maksimum bildirim sayısı
  const DISPLAY_LIMIT = 3;
  const notificationsToDisplay = filteredNotifications.slice(0, DISPLAY_LIMIT);


  return (
    <header className='bg-white border-b border-gray-200 p-3 pl-12 md:pl-4 flex justify-between items-center shadow-sm z-40'>
      <Link
        to={user?.role === "ROLE_SELLER" ? '/satici/dogrulama' : '/satici/satici-dogrulama'}
        className='flex-shrink-0'
      >
        <img src={sanayice} alt="Logo" className="cursor-pointer h-14 w-auto" />
      </Link>

      <div className="flex items-center space-x-4 pr-2">

        {/* Bildirimler Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            className={iconStyle}
            onClick={() => setNotifOpen(!notifOpen)}
            aria-expanded={notifOpen}
            aria-label="Bildirimler"
          >
            <BsBellFill className='text-xl text-gray-600' />
            {/* Okunmamış Sayısı */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden p-0 z-50 transform translate-y-0 opacity-100 transition-all duration-200 ease-out">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <BsBellFill className='text-orange-500' /> Son Bildirimler
                </p>
                <span className="text-sm font-bold text-orange-600">
                  ({unreadCount} Yeni)
                </span>
              </div>

              <ul className="text-sm max-h-80 overflow-y-auto">
                {notificationsToDisplay.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">Henüz bildirim yok.</li>
                ) : (
                  notificationsToDisplay.map((notif) => {
                    const { Icon, color } = getNotificationIcon(notif.text);

                    return (
                      <li
                        key={notif.id}
                        className={`flex items-start p-3 border-b border-gray-200 last:border-none cursor-pointer transition-colors ${notif.isRead ? 'bg-white hover:bg-gray-100' : 'bg-orange-50 hover:bg-orange-100 font-medium'}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <span className={`mr-2 mt-0.5 ${color}`}>
                          <Icon className="w-4 h-4" />
                        </span>

                        <div className='flex-grow'>
                          <p className={notif.isRead ? 'text-gray-700' : 'text-gray-900'}>{notif.text}</p>
                          <span className={`text-xs ${notif.isRead ? 'text-gray-500' : 'text-orange-600'}`}>{notif.time}</span>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0 mt-2" title="Okunmadı"></div>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Link
                  to={user?.role === "ROLE_SELLER" ? "/satici/bildirimler" : "/satici/bildirimler"}
                  onClick={() => setNotifOpen(false)}
                  className="block text-center text-sm text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  Tüm {filteredNotifications.length} Bildirimi Gör
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Kullanıcı Menüsü Dropdown */}
        <div
          className="relative"
          ref={menuRef}
        >
          <button
            className={profileIconStyle + ' flex items-center gap-1.5 px-2'}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Kullanıcı Menüsü"
          >
            <FaUser className='text-lg' />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-200 shadow-xl rounded-lg p-0 z-50 transform translate-y-0 opacity-100 transition-all duration-200 ease-out">
              <div className="p-4 border-b border-gray-200 bg-orange-50">
                <p className="text-center text-gray-800 font-semibold text-sm truncate">{user.name}</p>
                <span className="text-center text-gray-500 text-xs block">{user.role === 'ROLE_SELLER' ? 'Satıcı' : 'Yönetici'}</span>
              </div>

              <div className="p-3 text-sm space-y-1">
                <Link
                  to="/satici/satici-profil"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2 px-1 hover:bg-gray-100 rounded transition-colors text-gray-700"
                >
                  <FaRegUser className='text-base text-orange-500' />
                  Profilim
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2 px-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors w-full"
                  type='button'
                >
                  <LuLogOut className='text-base text-red-500' />
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