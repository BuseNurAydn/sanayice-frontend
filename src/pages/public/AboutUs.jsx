import React, { useState, useEffect } from 'react';
import Logo from '../../assets/png/KeremYılmaz.png';
import { FaRocket, FaEye, FaHeart, FaUsers, FaShieldAlt, FaTruck, FaStar, FaQuoteLeft } from 'react-icons/fa';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    satisfaction: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animated counters
    const animateCounters = () => {
      const targets = { customers: 50000, products: 10000, satisfaction: 99 };
      const duration = 2000;
      const steps = 60;
      const increment = {
        customers: targets.customers / steps,
        products: targets.products / steps,
        satisfaction: targets.satisfaction / steps
      };

      let step = 0;
      const timer = setInterval(() => {
        if (step < steps) {
          setCounters({
            customers: Math.floor(increment.customers * step),
            products: Math.floor(increment.products * step),
            satisfaction: step < steps - 1 ? Math.floor(increment.satisfaction * step) : 99
          });
          step++;
        } else {
          clearInterval(timer);
        }
      }, duration / steps);
    };

    setTimeout(animateCounters, 500);
  }, []);

  const ValueCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
    <div 
      className={`bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 ${color} rounded-full mx-auto mb-6 flex items-center justify-center transform hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-2xl text-white" />
      </div>
      <h4 className="text-xl font-bold text-gray-800 mb-4">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-y-6"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className={`text-3xl md:text-7xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Hakkımızda
          </h1>
          <p className={`text-xl md:text-2xl opacity-95 max-w-4xl mx-auto leading-relaxed font-light ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            Sanayice olarak, kaliteli ürünleri kullanıcılarımızla buluşturmak için 
            <span className="font-semibold text-yellow-200"> tutkuyla </span>
            çalışıyoruz
          </p>
          
        
        </div>
      </div>

      {/* Hikayemiz */}
      <div className="relative max-w-7xl mx-auto px-3 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-6">
              Hikayemiz
            </div>
            <h2 className="text-xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
              Bir <span className="text-orange-600">Rüya</span> ile Başladı
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Sanayice, 2025 yılında e-ticaret sektöründe fark yaratmak amacıyla kuruldu. 
                Müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunma hedefiyle 
                <span className="font-semibold text-orange-600"> cesur bir yolculuk </span>
                başlattık.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Teknolojinin gücünü kullanarak, geleneksel alışveriş deneyimini 
                dijital çağa taşıyoruz. Her geçen gün büyüyen ürün yelpazemiz ve 
                müşteri memnuniyeti odaklı yaklaşımımızla sektörde öncü olmaya devam ediyoruz.
              </p>
            </div>
          </div>
          
          <div className={`${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 backdrop-blur-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center group">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {counters.customers.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 font-medium">Mutlu Müşteri</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-2 rounded-full"></div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {counters.products.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 font-medium">Ürün Çeşidi</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-2 rounded-full"></div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-gray-600 font-medium">Müşteri Desteği</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto mt-2 rounded-full"></div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {counters.satisfaction}%
                  </div>
                  <div className="text-gray-600 font-medium">Memnuniyet Oranı</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-2 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vizyon ve Misyon */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
        <div className="relative max-w-7xl mx-auto px-3 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-2xl md:text-5xl font-bold text-gray-800 mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Vizyon & <span className="text-orange-600">Misyon</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Misyon */}
            <div className={`bg-gradient-to-br from-orange-100 via-orange-50 to-pink-100 rounded-3xl p-5 md:p-10 shadow-xl border border-orange-200 transform hover:scale-105 transition-all duration-500 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mr-6 transform hover:rotate-12 transition-transform duration-300">
                  <FaRocket className="text-2xl text-white" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-gray-800">Misyonumuz</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Sanayice olarak misyonumuz, kullanıcılarımızın ihtiyaç duyduğu 
                kaliteli ürünleri web sitemiz üzerinden 
                <span className="font-semibold text-orange-700"> güvenli, hızlı ve kolay </span>
                bir şekilde ulaştırmaktır. Müşteri memnuniyetini her zaman ön 
                planda tutarak, alışveriş deneyimini mükemmelleştirmeyi hedefliyoruz.
              </p>
            </div>

            {/* Vizyon */}
            <div className={`bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 rounded-3xl p-5 md:p-10 shadow-xl border border-blue-200 transform hover:scale-105 transition-all duration-500 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-6 transform hover:rotate-12 transition-transform duration-300">
                  <FaEye className="text-2xl text-white" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-gray-800">Vizyonumuz</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Türkiye'nin 
                <span className="font-semibold text-blue-700"> en güvenilir ve yenilikçi </span>
                e-ticaret platformu olmak. 
                Teknolojinin sunduğu imkanları kullanarak, müşterilerimize benzersiz 
                bir alışveriş deneyimi yaşatmak ve sektörde öncü bir marka haline 
                gelmek vizyonumuzdur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Değerlerimiz */}
      <div className="py-20 relative">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-2xl md:text-5xl font-bold text-gray-800 mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Değerlerimiz
            </h2>
            <p className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              Bizi biz yapan ve her kararımızda rehber olan temel değerlerimiz
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={FaHeart}
              title="Müşteri Odaklılık"
              description="Müşterilerimizin memnuniyeti bizim için her şeyden önce gelir. Onların sesini dinler ve beklentilerini aşmaya odaklanırız."
              color="bg-gradient-to-r from-red-500 to-pink-500"
              delay={0}
            />
            <ValueCard 
              icon={FaShieldAlt}
              title="Güvenilirlik"
              description="Güvenli alışveriş ortamı ve kaliteli ürünler sunmayı taahhüt ediyoruz. Şeffaflık ve dürüstlük ilkelerimizdir."
              color="bg-gradient-to-r from-blue-500 to-indigo-500"
              delay={200}
            />
            <ValueCard 
              icon={FaTruck}
              title="Hızlı Teslimat"
              description="Siparişlerinizi en kısa sürede ve kusursuz bir şekilde kapınıza ulaştırıyoruz. Zamanınız bizim için değerlidir."
              color="bg-gradient-to-r from-green-500 to-teal-500"
              delay={400}
            />
          </div>
        </div>
      </div>

      {/* CEO Bölümü */}
<div className="relative py-10 md:py-20 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10"></div>
  
  <div className="relative max-w-7xl mx-auto px-3 md:px-6">
    <div className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/50 shadow-2xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-1 text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={Logo}
                alt="Kerem Yılmaz"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Kerem Yılmaz</h3>
          <p className="text-orange-400 font-semibold text-lg">Kurucu & CEO</p>
          <div className="flex justify-center space-x-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <FaQuoteLeft className=" text-xl md:text-4xl text-orange-400 mb-6 opacity-50" />
          <blockquote className="text-lg md:text-xl leading-relaxed text-gray-100 mb-8">
            "Sanayice'i kurma amacımız, e-ticaret sektöründe müşteri deneyimini 
            yeniden tanımlamaktı. Teknolojinin gücünü kullanarak, insanların 
            günlük yaşamlarını kolaylaştıran bir platform oluşturmak istedik. 
            Bugün geldiğimiz noktada, müşterilerimizin güvenini kazanmış olmaktan 
            ve onlara değer katabilmekten gurur duyuyoruz."
          </blockquote>
          
          <div className="flex items-center">
            <div className="w-2 h-16 bg-gradient-to-b from-orange-400 to-pink-400 mr-6 rounded-full"></div>
            <div>
              <p className="font-bold text-white text-lg">Kerem Yılmaz</p>
              <p className="text-gray-400">Kurucu & CEO, Sanayice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-orange-600 via-pink-500 to-purple-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform skew-y-3"></div>
        
        <div className="relative max-w-4xl mx-auto px-3 md:px-6 text-center text-white">
          <h2 className={`text-2xl md:text-5xl font-bold mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Bizimle <span className="text-yellow-200">Alışverişe</span> Başlayın
          </h2>
          <p className={`text-base md:text-xl mb-10 opacity-95 leading-relaxed max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            Kaliteli ürünler, uygun fiyatlar ve mükemmel hizmet için Sanayice'i tercih edin. 
            Siz de bu büyüleyici deneyimin bir parçası olun!
          </p>
          
          <button className={`group bg-white text-gray-800 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-3xl ${isVisible ? 'animate-bounce' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
            <span className="flex items-center justify-center">
              Alışverişe Başla
              <FaRocket className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
          
          <div className="mt-8 flex justify-center space-x-6 text-sm opacity-75">
            <span>✨ Ücretsiz Kargo</span>
            <span>🔒 Güvenli Ödeme</span>
            <span>⚡ Hızlı Teslimat</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;