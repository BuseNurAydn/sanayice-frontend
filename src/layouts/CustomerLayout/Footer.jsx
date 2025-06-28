import {Link} from 'react-router-dom';
import Logo from '../../assets/png/Logo2.png';
import GooglePlay from '../../assets/svg/playstore.svg';
import AppStore from '../../assets/png/AppStore.jpg';
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6"; // X (Twitter) ikonu için

const Footer = () => {
  return (
    <footer className="bg-[var(--color-gray)] pt-8 text-sm custom-font">
     
      {/* Üst Bölüm */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* Sol - Logo ve Uygulama Linkleri */}
        <div>
          <img src={Logo} alt="Sanayice" className="mb-4 " />
          <div className="flex gap-2">
            <img src={AppStore} alt="App Store" className='h-10'/>
            <img src={GooglePlay} alt="Google Play" className="h-10" />
          </div>
          <p className="text-sm mt-2">Şirket,şirketler meclisine kayıtlıdır.</p>
        </div>

        {/* Ortadaki - Abonelik Alanı */}
        <div className='flex flex-col space-y-4'>
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Özel Fırsatları Gelen Kutunuza Alın</h3>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="keremyilmazky06@gmail.com"
              className="flex-1 py-3 rounded-l-full bg-[var(--color-gray)] outline-none"
            />
            
          </div>
          <p className="text-[10px] mt-1">Spam göndermeyeceğiz, e-posta politikamızı okuyun</p>
          <div className="flex space-x-3 mt-3 text-xl">
            <a href="https://www.facebook.com/sanayice/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className='w-8 h-8' />
            </a>
            <a href="https://www.instagram.com/sanayice" target="_blank" rel="noopener noreferrer">
              <AiFillInstagram className='w-8 h-8'/>
            </a>
            <a href="https://www.youtube.com/@sanayicecom" target="_blank" rel="noopener noreferrer">
              <IoLogoYoutube className='w-8 h-8'/>
            </a>
            <a href="https://www.linkedin.com/company/sanayice/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className='w-8 h-8'/>
            </a>
            <a href="https://x.com/sanayice" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className='w-8 h-8'/>
            </a>
          </div>
        </div>

        {/* Sağdaki Linkler */}
        <div>
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Kurumsal</h3>
          <ul className="space-y-4 text-sm underline">
            <li><Link to="/about_us">Hakkımızda</Link></li>
            <li><Link to="/contact">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-[var(--color-dark)]">Önemli Linkler</h3>
          <ul className="space-y-4 text-sm underline">
            <li><Link to="/auth/signUp/seller">Satıcı Olmak İstiyorum</Link></li>
          </ul>
        </div>
      </div>

      {/* Alt Çizgi ve Alt Bilgi */}
      <div className="bg-[#0e1229] w-full text-white mt-10 py-4 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p> @2025 Sanayice. Tüm hakları saklıdır</p>
          <div className="flex space-x-8 mt-2 md:mt-0">
            <Link to="/privacy_policy">Gizlilik Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer;