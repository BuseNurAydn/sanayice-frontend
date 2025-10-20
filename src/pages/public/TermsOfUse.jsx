import React from 'react';
import { FaGavel, FaCalendarAlt, FaShieldAlt, FaExclamationTriangle, FaUsers, FaLock, FaFileContract, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const TermsOfUse = () => {
  const sections = [
    {
      id: 'genel-kosullar',
      title: 'Genel Kullanım Koşulları',
      icon: <FaFileContract className="w-5 h-5" />,
      content: 'Sanayice platformu dahilinde Sanayice.com web sitesini, siteye ait mobil uygulamayı, eklentisi olan diğer uygulamalarını Satıcı/Alıcı/Üye/Üye olmadan kullanıcı her ne sıfat ile olursa olsun kullanmanız durumunda aşağıda belirtilen kullanım koşullarını kabul etmiş ve yasal uyarılardan haberdar olduğunuz kabul edilecektir.'
    },
    {
      id: 'sorumluluk',
      title: 'Sorumluluk Reddi',
      icon: <FaExclamationTriangle className="w-5 h-5" />,
      content: 'Bu siteye, siteye ait mobil uygulamaya, eklentisi olan uygulamalara girmiş olmanız, sunulan hizmetlerden yararlanmış olmanız, veri girişi sağlamanız veya sunulan verileri kullanmanız vs. durumlarında sözleşmenin ihlal edilmesi, haksız fiilde bulunulması, başkaca bir hukuka aykırılık ile doğrudan veya dolaylı uğramış olduğunuz zararlardan Şahıs Şirketimiz (www.sanayice.com) sorumlu değildir.'
    },
    {
      id: 'kesinti-sorumluluk',
      title: 'Kesinti ve Teknik Sorunlar',
      icon: <FaShieldAlt className="w-5 h-5" />,
      content: 'Sanayice, Platform dahilinde sitesinde, uygulamasında ve diğer eklentilerde sözleşmenin ihlal edilmesi, mücbir sebepler oluşması, iletişim hatası, virüs saldırısı, haksız fiil gerçekleşmesi veya herhangi bir hukuka aykırılık neticesiyle kesinti, ihmal, hata, sorun meydana gelmesi hallerinde sorumluluk kabul etmemekte ve bu durumların meydana gelmeyeceğine ilişkin bir taahhütte bulunmamaktadır.'
    },
    {
      id: 'dis-baglantilar',
      title: 'Dış Bağlantılar ve Yönlendirmeler',
      icon: <FaInfoCircle className="w-5 h-5" />,
      content: 'Bu platform dahilindeki internet sitesinde, uygulamasında ve diğer eklentilerinde başkaca web sitesi, bağlantı ve referanslara yönlendirme bulunabilmektedir. Sanayice bu yönlendirilen web sitesi, bağlantı ve referanslara ilişkin bir kontrol yükümlülüğü bulunmamakta, güvenirliği, doğrulu veya başkaca hususlarda bir taahhüdü bulunmamakta doğabilecek her türlü zarara karşı bir yükümlülüğü bulunmamaktadır. Bu durumlarda münhasır sorumluluk Satıcı/Alıcı/Üye/Üye olmadan kullanıcı her ne sıfat ile olursa olsun platformu kullanan sizlere aittir.'
    },
    {
      id: 'fikri-haklar',
      title: 'Fikri Mülkiyet Hakları',
      icon: <FaLock className="w-5 h-5" />,
      content: 'Sanayice platformunun dahilindeki internet sitesi, mobil uygulamaları ve eklentisi olan uygulamaların tasarım, dizayn, içeriğinde bulunan bilgi, resim, markaların, Sanayice unvanının, logo, ikon, demonstratif, yazılı, elektronik, grafik veya makinede okunabilir şekilde sunulan teknik veriler, bilgisayar yazılımları, uygulanan satış sistemi, iş metodu ve iş modeli de dahil tüm materyallerin ve bunlara ilişkin fikri sınai hakların sahibi veya yasal yetkilisidir. Belirtilen platform dahilinde bulunan her türlü materyal izin alınmaksızın ve kaynak gösterilmeksizin kopyalanamaz, çoğaltılamaz, başka bir yerde yayınlanamaz, başkaca lisansa çevrilemez, postalanamaz, iletilemez, sunulamaz ya da dağıtılamaz.'
    },
    {
      id: 'degisiklik-hakki',
      title: 'Değişiklik Yapma Hakkı',
      icon: <FaUsers className="w-5 h-5" />,
      content: 'Sanayice iş bu platform dahilinde web sitesinde, uzantılarında, uygulamalarında, ek her türlü sanal ortamda bulunan bilgileri, sunulan hizmetleri, kullanım koşullarını önceden ihtarda bulunmaksızın değiştirme, kaldırma, yenilerini ekleme hakkı ve yetkisine sahiptir. Sanayice iş bu mecraları önceden ihtarda bulunmaksızın organize etme, yayını durdurma, kampanya ve koşullar ekleme hakkı ve yetkisine sahiptir. Tüm bu değişiklikler belirtilen mecralarda yayınlandığı anda yürürlüğe girmektedir.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-3 md:px-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-orange-700 opacity-20"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <FaGavel className="w-8 h-8 text-orange-200 mr-3" />
              <span className="text-orange-100 font-medium">Yasal Belgeler</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">Kullanım Koşulları</h1>
            <p className="md:text-lg text-orange-100 mb-4">
              Sanayice platformunu kullanmadan önce lütfen bu koşulları dikkatlice okuyunuz
            </p>
            <div className="flex items-center justify-center text-orange-100">
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              <span>Son güncelleme: 14 Temmuz 2025</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-400 rounded-full opacity-20 transform translate-x-16 -translate-y-8"></div>
          <div className="absolute right-20 bottom-0 w-20 h-20 bg-orange-300 rounded-full opacity-15 transform translate-y-8"></div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <FaExclamationTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Önemli Bilgilendirme</h3>
              <p className="text-amber-700">
                Sanayice platformunu kullanarak aşağıdaki tüm koşulları kabul etmiş sayılırsınız. 
                Bu koşullar yasal bağlayıcılığa sahiptir ve platformun güvenli kullanımı için tasarlanmıştır.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" />
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <span className="text-blue-600 mr-3">{section.icon}</span>
                <span className="text-gray-700 group-hover:text-blue-600">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800">{section.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    <span>Madde {index + 1}</span>
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-justify">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8 mt-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
              <FaCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-semibold text-gray-800">Güncelleme Politikası</h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                  7
                </span>
                <span>Madde 7</span>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              Sanayice, her zaman bu yasal uyarı sayfasının içeriğini güncelleme yetkisini saklı tutmakta 
              ve kullanıcılarına siteye her girişte yasal uyarı sayfasını ziyaret etmelerini tavsiye etmektedir.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Kullanıcı Sorumluluğu</h4>
              <p className="text-blue-700 text-sm">
                Sizler bu mecraları kullanmanız ile bu değişiklikleri yapma hak ve yetkisinin Sanayice'de 
                olduğunu kabul etmiş ve yapılan değişiklikleri yayınlanmasından itibaren kabul etmiş sayılmaktasınız.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Warning */}
        <div className="bg-red-50 border-l-4 border-red-400 p-6 mt-8 rounded-r-lg">
          <div className="flex items-start">
            <FaExclamationTriangle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Yasal Uyarı</h3>
              <p className="text-red-700">
                Sanayice'nin tüm saklı hakları yasal koruma altında olup aykırı davranış ve ihlallerin 
                hukuki ve cezai sorumluluk gerektirdiği sizlere bildirilmektedir.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <FaGavel className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">Sanayice Yasal Belgeler</span>
          </div>
          <p className="text-gray-500 text-sm">
            Bu belge ile ilgili sorularınız için{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              iletişim sayfamızı
            </a>{' '}
            ziyaret edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;