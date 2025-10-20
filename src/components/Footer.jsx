import { Link } from "react-router-dom";
import PlayStore from "../assets/png/PlayStore.png";
import AppStore from "../assets/png/AppStore.png";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import visaMastercard from "../assets/png/visa_mastercard.png";

const Footer = () => {
  const bgColor = "var(--color-gray)";
  const textColor = "var(--color-dark)";

  return (
    <footer style={{ backgroundColor: bgColor }} className="pt-10 text-sm custom-font text-gray-700">
      {/* Bölüm 1: Ana Linkler ve Sosyal Medya */}
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-2 md:grid-cols-7 gap-y-8 pb-10">
        <div className="col-span-1">
          <h3 style={{ color: textColor }} className="font-bold mb-4 text-base"> Kurumsal</h3>
          <ul className="space-y-3">
            <li><Link to="/hakkimizda" className=" hover:text-[var(--color-dark-orange)] transition-colorse"> Hakkımızda </Link></li>
            <li><Link to="/iletisim" className=" hover:text-[var(--color-dark-orange)] transition-colors">İletişim</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 style={{ color: textColor }} className="font-bold mb-4 text-base">Sözleşmeler</h3>
          <ul className="space-y-3">
            <li><Link to="/gizlilik-politikasi" className="hover:text-[var(--color-dark-orange)] transition-colors"> Gizlilik Politikası</Link></li>
            <li><Link to="/kullanim-sozlesmesi" className="hover:text-[var(--color-dark-orange)] transition-colors">Kullanım Koşulları </Link></li>
            <li><Link to="/uyelik-sozlesmesi" className="hover:text-[var(--color-dark-orange)] transition-colors">Üyelik Sözleşmesi</Link></li>
            <li><Link to="/iptal-iade" className="hover:text-[var(--color-dark-orange)] transition-colors"> Mesafeli Satış Sözleşmesi</Link></li>
          </ul>
        </div>

        <div className="col-span-2">
          <h3 style={{ color: textColor }} className="font-bold mb-4 text-base">Bizi Takip Edin</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <a href="https://www.facebook.com/sanayice/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2  hover:text-[var(--color-dark-orange)] transition-colors"
            ><FaFacebook className="w-5 h-5 text-blue-700" /> Facebook </a>
            <a href="https://www.instagram.com/sanayice" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors"
            ><AiFillInstagram className="w-5 h-5 text-pink-600" /> Instagram</a>
            <a href="https://www.youtube.com/@sanayicecom" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors"
            ><IoLogoYoutube className="w-5 h-5 text-red-600" /> YouTube </a>
            <a href="https://www.linkedin.com/company/sanayice/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors"
            ><FaLinkedin className="w-5 h-5 text-blue-800" /> LinkedIn</a>
            <a href="https://x.com/sanayice" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors"
            ><FaXTwitter className="w-5 h-5 text-gray-900" /> X</a>
          </div>
        </div>

        <div className="col-span-1">
          <h3 style={{ color: textColor }} className="font-bold mb-4 text-base"> Önemli Linkler </h3>
          <ul className="space-y-3">
            <li><Link to="/giris-kaydol/satici/uye-ol" className=" hover:text-[var(--color-dark-orange)] transition-colors">Satıcı Olmak İstiyorum</Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2 space-y-3">
          <h3 style={{ color: textColor }} className="font-bold mb-4 text-base">Destek Hattı</h3>
          <div className="border border-gray-400 rounded-lg p-2 text-center text-xs cursor-pointer transition-colors hover:bg-gray-50">
            <p className="font-semibold">Çağrı Merkezini Arayın</p>
          </div>

          <a href="tel:08502551205" className="text-[var(--color-dark-orange)] mt-1 block font-bold text-xl"
          >0850 255 12 05
          </a>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-400"></div>
            <span className="text-gray-500 text-xs font-semibold">veya</span>
            <div className="flex-1 h-px bg-gray-400"></div>
          </div>

          <a
            href="https://wa.me/908502551205"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-lg font-bold text-sm transition-colors hover:bg-green-600 shadow-md"
          >
            <FaWhatsapp size={20} /> Anında WhatsApp Destek
          </a>
        </div>
      </div>

      {/* Bölüm 2: Uygulama & Güvenli Alışveriş */}
      <div className="max-w-7xl mx-auto px-5 mt-2 grid grid-cols-1 md:grid-cols-3 ">
        {/* Uygulama Linkleri */}
        <div className="flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-gray-300 pb-6 md:pb-0 md:pr-12">
          <h3 style={{ color: textColor }} className="font-bold mb-3 text-base">Uygulamamızı İndirin</h3>
          <div className="flex gap-3">
            <a href="#" className="transition-opacity hover:opacity-80">
              <img src={AppStore} alt="App Store" className="h-12 w-auto shadow-md rounded-lg"/>
            </a>
            <a href="#" className="transition-opacity hover:opacity-80">
              <img src={PlayStore} alt="Google Play" className="h-12 w-auto shadow-md rounded-lg"/>
            </a>
          </div>
        </div>
        {/* Güvenli Alışveriş */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className={`font-bold text-[${textColor}] text-base leading-none`}>Güvenli Alışveriş</h3>
          <img src={visaMastercard}  alt="Güvenli Ödeme Yöntemleri: Visa, Mastercard" 
          className="h-42 w-auto -mt-[40px]" />
        </div>
      </div>

      {/* Alt*/}
      <div
        style={{ backgroundColor: "#0e1229" }}
        className="w-full text-white mt-8 py-4 text-sm"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-center md:justify-start">
          <p className="text-center md:text-left text-gray-400">
            &copy; {new Date().getFullYear()} Sanayice. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
