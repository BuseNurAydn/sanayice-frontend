import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaLock, FaUserShield, FaEye, FaFileContract, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      id: 'collection',
      title: 'Toplanan Bilgiler',
      icon: FaEye,
      content: [
        'Ad, soyad ve iletişim bilgileriniz',
        'E-posta adresi ve telefon numaranız',
        'Teslimat ve fatura adresi bilgileriniz',
        'Ödeme bilgileriniz (güvenli şekilde işlenir)',
        'Site kullanım bilgileri ve çerez verileri',
        'Sipariş geçmişi ve alışveriş tercihleriniz'
      ]
    },
    {
      id: 'usage',
      title: 'Bilgilerin Kullanım Amacı',
      icon: FaUserShield,
      content: [
        'Siparişlerinizi işleme alma ve teslimat',
        'Müşteri hizmetleri desteği sağlama',
        'Ürün ve kampanya bilgilendirmeleri',
        'Site deneyiminizi kişiselleştirme',
        'Yasal yükümlülüklerimizi yerine getirme',
        'Güvenlik ve dolandırıcılık önleme'
      ]
    },
    {
      id: 'sharing',
      title: 'Bilgi Paylaşımı',
      icon: FaLock,
      content: [
        'Kişisel bilgileriniz üçüncü taraflarla satılmaz',
        'Kargo firmaları ile sadece teslimat için paylaşılır',
        'Ödeme işlemleri güvenli ödeme sağlayıcıları ile yapılır',
        'Yasal zorunluluklar haricinde paylaşım yapılmaz',
        'İş ortaklarımız gizlilik sözleşmesi ile bağlıdır'
      ]
    },
    {
      id: 'security',
      title: 'Güvenlik Önlemleri',
      icon: FaShieldAlt,
      content: [
        'SSL sertifikası ile şifreleme koruması',
        'Güvenli sunucu altyapısı kullanımı',
        'Düzenli güvenlik güncellemeleri',
        'Sınırlı erişim ve yetkilendirme sistemi',
        'Veri yedekleme ve koruma protokolleri'
      ]
    },
    {
      id: 'rights',
      title: 'Haklarınız',
      icon: FaFileContract,
      content: [
        'Kişisel verilerinizi görme hakkı',
        'Bilgilerinizi düzeltme ve güncelleme hakkı',
        'Verilerinizin silinmesini talep etme hakkı',
        'Veri işlemeye itiraz etme hakkı',
        'Şikayetlerinizi ilgili mercilere iletme hakkı'
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 transform -skew-y-3"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 ${isVisible ? 'animate-bounce' : 'opacity-0'}`}>
            <FaShieldAlt className="text-3xl" />
          </div>
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Gizlilik Politikası
          </h1>
          <p className={`text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            Kişisel bilgilerinizin güvenliği bizim için çok önemli. Bu sayfada verilerinizi nasıl koruduğumuzu öğrenebilirsiniz.
          </p>
          <div className={`mt-6 text-sm opacity-75 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Giriş */}
        <div className={`bg-white rounded-2xl p-8 shadow-lg mb-12 border border-gray-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            Gizlilik Politikamız
          </h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              Sanayice olarak, kişisel verilerinizin korunması konusunda sorumluluğumuzun bilincindeyiz. 
              Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde ve hizmetlerimizi kullandığınızda 
              kişisel bilgilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
            </p>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, kişisel verilerinizi 
              işlerken yasal yükümlülüklerimizi yerine getirmekte ve en yüksek güvenlik standartlarını 
              uygulamaktayız.
            </p>
          </div>
        </div>

        {/* Bölümler */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div
                key={section.id}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 transform hover:scale-110 transition-transform duration-200">
                      <Icon className="text-xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <FaCheckCircle className="text-green-500 text-sm mt-1 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Çerezler */}
        <div className={`bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-8 mt-12 border border-orange-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">🍪</span>
            </div>
            Çerez Politikası
          </h3>
          <div className="space-y-4 text-gray-700">
            <p>
              Web sitemiz, size daha iyi hizmet verebilmek için çerezler (cookies) kullanmaktadır. 
              Çerezler, tarayıcınız tarafından bilgisayarınızda saklanan küçük metin dosyalarıdır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">Zorunlu Çerezler</h4>
                <p className="text-sm text-gray-600">Site işlevselliği için gerekli olan temel çerezler</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">Analitik Çerezler</h4>
                <p className="text-sm text-gray-600">Site performansını iyileştirmek için kullanılan çerezler</p>
              </div>
            </div>
          </div>
        </div>

        {/* İletişim */}
        <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mt-12 border border-blue-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1200ms' }}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaPhone className="text-blue-600 mr-3" />
            Bizimle İletişime Geçin
          </h3>
          <p className="text-gray-700 mb-6">
            Gizlilik politikamız hakkında sorularınız varsa veya kişisel verilerinizle ilgili haklarınızı 
            kullanmak istiyorsanız, aşağıdaki kanallardan bize ulaşabilirsiniz:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <FaEnvelope className="text-2xl text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">E-posta</h4>
              <p className="text-sm text-gray-600">gizlilik@sanayice.com</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <FaPhone className="text-2xl text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Telefon</h4>
              <p className="text-sm text-gray-600">0850 XXX XX XX</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <FaMapMarkerAlt className="text-2xl text-red-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Adres</h4>
              <p className="text-sm text-gray-600">İstanbul, Türkiye</p>
            </div>
          </div>
        </div>

        {/* Son Notlar */}
        <div className={`bg-gray-50 rounded-2xl p-8 mt-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1400ms' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Önemli Notlar</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 text-sm mt-1 mr-3 flex-shrink-0" />
              <span>Bu gizlilik politikası, değişen yasal düzenlemeler ve iş süreçlerimiz doğrultusunda güncellenebilir.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 text-sm mt-1 mr-3 flex-shrink-0" />
              <span>Yapılan değişiklikler web sitemizde yayınlandığı tarihten itibaren geçerli olacaktır.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 text-sm mt-1 mr-3 flex-shrink-0" />
              <span>Hizmetlerimizi kullanmaya devam ederek bu politikayı kabul etmiş sayılırsınız.</span>
            </li>
          </ul>
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;