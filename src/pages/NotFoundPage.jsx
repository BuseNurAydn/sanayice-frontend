import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        // min-h-[70vh] ile sayfanın en azından görünüm alanının çoğunu kaplamasını sağlıyoruz
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-gray-50">
            <h1 className="text-7xl font-extrabold text-orange-600">404</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-4 mb-3">
                Üzgünüz, Aradığınız Sayfayı Bulamadık
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Aradığınız sayfa silinmiş veya adresi değiştirilmiş olabilir. Lütfen aşağıdaki bağlantıları deneyin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    <Home className="w-5 h-5" /> Ana Sayfaya Dön
                </Link>
                
                <Link 
                    to="/giris-kaydol/giris-yap" 
                    className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition"
                >
                    <Search className="w-5 h-5" /> Giriş Yap
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;