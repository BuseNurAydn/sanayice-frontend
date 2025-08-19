import { Link } from 'react-router-dom';
import Logo from '../../assets/png/Logo2.png';
import GooglePlay from '../../assets/svg/playstore.svg';
import AppStore from '../../assets/png/AppStore.jpg';
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6"; // X (Twitter) ikonu için

const Footer = () => {
  return (
    <footer className="bg-[var(--color-gray)] pt-8 text-sm custom-font ">

      {/* Üst Bölüm */}
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-6 gap-14">
        <div>

          <div className="flex flex-col">
            <h3 className="font-bold mb-2 text-[var(--color-dark)]">Uygulamamızı İndirin</h3>
            <div className="flex flex-col gap-2">
              <img src={AppStore} alt="App Store" className='h-10' />
              <img src={GooglePlay} alt="Google Play" className="h-10" />
            </div>
          </div>
        </div>

        {/* Sol - Logo ve Uygulama Linkleri */}
        <div className='flex flex-col'>
          {/*<img src={Logo} alt="Sanayice" className="mb-4 " />*/}
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Kurumsal</h3>
          <div className="flex gap-2">
            <ul className="space-y-4 text-sm">
              <li><Link to="/about_us">Hakkımızda</Link></li>
              <li><Link to="/contact">İletişim</Link></li>
            </ul>
          </div>
        </div>


        <div className='flex flex-col space-y-4'>
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Bizi Takip Edin</h3>
          <div className="flex flex-col space-y-3 mt-3 text-sm custom-font">
            <a href="https://www.facebook.com/sanayice/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors">
              <FaFacebook className='w-6 h-6' /> Facebook
            </a>
            <a href="https://www.instagram.com/sanayice" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors">
              <AiFillInstagram className='w-6 h-6' /> Instagram
            </a>
            <a href="https://www.youtube.com/@sanayicecom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors">
              <IoLogoYoutube className='w-6 h-6' /> YouTube
            </a>
            <a href="https://www.linkedin.com/company/sanayice/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors">
              <FaLinkedin className='w-6 h-6' /> LinkedIn
            </a>
            <a href="https://x.com/sanayice" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--color-dark-orange)] transition-colors">
              <FaXTwitter className='w-6 h-6' /> X
            </a>
          </div>
        </div>


        {/* Sağdaki Linkler */}
        <div>
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Sözleşmeler</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/privacy_policy">Gizlilik Politikası</Link></li>
            <li><Link to="/terms_of_use">Kullanım Koşulları</Link></li>
            <li><Link to="/return_policy">İptal ve İade Koşulları</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Önemli Linkler</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/auth/signUp/seller">Satıcı Olmak İstiyorum</Link></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Destek Hattı</h3>

          {/* Çağrı Merkezi */}
          <div className="border border-gray-400 rounded-lg p-2 text-center text-xs cursor-pointer transition-colors hover:bg-gray-50">
            <p className="font-semibold">Çağrı Merkezini Arayın</p>
          </div>

          <Link to="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className=" text-[var(--color-dark-orange)] mt-1 block font-bold text-xl">
            0850 000 00 00
          </Link>
          
          {/* Ayırıcı */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-400"></div>
            <span className="text-gray-500 text-xs font-semibold">veya</span>
            <div className="flex-1 h-px bg-gray-400"></div>
          </div>

          {/* WhatsApp Destek */}
          <div className="border border-gray-400 rounded-lg p-2 text-center text-xs cursor-pointer transition-colors flex items-center justify-center gap-1 hover:bg-gray-50">
            <FaWhatsapp size={24} className="text-green-500" />
            <span className="font-semibold">WhatsApp Destek</span>
          </div>

        </div>

      </div>

      {/* Alt Çizgi ve Alt Bilgi */}
      <div className="bg-[#0e1229] w-full text-white mt-10 py-4 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p> @2025 Sanayice. Tüm hakları saklıdır</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer;