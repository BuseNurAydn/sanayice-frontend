import React from 'react';
import { FaInfoCircle, FaShieldAlt, FaUndo, FaTimes, FaCalendarAlt } from 'react-icons/fa';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-3 md:px-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-orange-700 opacity-20"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <FaShieldAlt className="w-8 h-8 text-orange-200 mr-3" />
              <span className="text-orange-100 font-medium">Güvenli Alışveriş</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">İptal ve İade Koşulları</h1>
            <div className="flex items-center justify-center text-orange-100">
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              <span>Son güncelleme: 20 Ekim 2025</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-400 rounded-full opacity-20 transform translate-x-16 -translate-y-8"></div>
          <div className="absolute right-20 bottom-0 w-20 h-20 bg-orange-300 rounded-full opacity-15 transform translate-y-8"></div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaUndo className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">14 Günlük İade Hakkı</h3>
            <p className="text-sm text-gray-600">Ürünü teslim aldıktan sonra 14 gün içinde sebepsiz iade edebilirsiniz.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Güvenli İade</h3>
            <p className="text-sm text-gray-600">Hatalı veya kusurlu ürünlerde kargo ücreti bizden.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaTimes className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Kolay İptal</h3>
            <p className="text-sm text-gray-600">Ürün kargolanmadan önce siparişinizi kolayca iptal edebilirsiniz.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-8">
          
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaInfoCircle className="w-5 h-5 text-blue-600 mr-2" />
              1. Genel Hükümler
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Geçerlilik:</strong> Bu iptal ve iade koşulları, Sanayice  platformu üzerinden yapılan tüm alışverişlerde geçerlidir. Sanayice, alıcı ve satıcı arasında yalnızca bir aracı platformdur ve doğrudan ürün tedarik etmez.</p>
              </div>
              <p><strong>İletişim:</strong> Tüm iptal ve iade talepleri, Sanayice platformu üzerinden yapılmalıdır.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. İptal Koşulları</h2>
            <ul className="space-y-4 text-gray-700 list-disc ml-8">
              <li>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Alıcı Tarafından İptal:</h3>
                <ul className="space-y-4">
                  <li><span className='font-medium text-gray-700'>Ürün Kargolanmadan Önce:</span> Alıcı, ürün kargoya verilmeden önce siparişini iptal etme hakkına sahiptir. Bu işlemi siparişler sayfası üzerinden gerçekleştirebilir.</li>
                  <li><span className='font-medium text-gray-700'>Ödeme İadesi:</span> İptal edilen siparişlerde, ödemenin iadesi alıcının kullandığı ödeme yöntemiyle 3-7 iş günü içinde yapılır.</li>
                </ul>
              </li>
              <li>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Özel Siparişler:</h3>
                <p>Kişiye özel veya özel üretim yapılan ürünlerde sipariş iptali, üretim başladıktan sonra yapılamaz</p>
              </li>
              <li>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Satıcı Tarafından İptal:</h3>
                <p>Satıcı, ürün tedarik sorunları, teknik sorunlar, veya stok yetersizliği gibi nedenlerle siparişi iptal edebilir. Bu durumda alıcıya bilgi verilir ve ödemenin tamamı iade edilir.</p>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. İade Koşulları</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p><strong>Koşulsuz İade Hakkı:</strong> Alıcı, ürün teslim alındıktan sonraki 14 gün içinde sebep belirtmeksizin iade talebinde bulunabilir. İade süreci, Sanayice platformu üzerinden başlatılmalıdır.</p>
              </li>
              <li className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p><strong>İade Şartları:</strong> Ürün kullanılmamış, hasarsız, orijinal ambalajında ve faturasıyla birlikte geri gönderilmelidir. İade edilecek ürünler, satıcının belirttiği kargo firması aracılığıyla gönderilmelidir.</p>
              </li>
              <li className="bg-slate-100 p-4 rounded-lg border border-slate-300">
                <p><strong>İade Edilemeyen Ürünler:</strong> Kullanılmış ambalajı bozulmuş, kişiye özel üretilen ürünler iade edilemez. </p>
              </li>  
            </ul>
          </section>


          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. İade Kargo Ücretleri</h2>
            <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-row gap-1">
                  <h3 className="font-semibold text-green-900 mb-2">Kargo Ücreti:</h3>
                  <span> Hatalı veya kusurlu ürünlerde kargo ücreti satıcı tarafından karşılanır.</span>
                </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. İade Süreci</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
                <p>İade edilen ürün, satıcıya ulaştıktan sonra incelenir. Ürünün iade koşullarına uygun olması durumunda, ödeme iadesi 7 iş günü içinde gerçekleştirilir.</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Hatalı ve Eksik Ürünler</h2>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">Alıcı, teslim aldığı üründe hata veya eksiklik tespit ederse, ürün teslim alındıktan sonraki <strong>3 iş günü</strong> içinde Sanayice platformu üzerinden durumu bildirmelidir.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cayma Hakkı</h2>
            <div className="space-y-4 text-gray-700">
              <p>Alıcı, mesafeli satış sözleşmesine uygun olarak, ürün teslim alındıktan sonraki 14 gün içinde cayma hakkını kullanabilir. Cayma hakkı kapsamında yapılan iadelerde, ürün orijinal ambalajında ve kullanılmamış olmalıdır.</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800"><strong>Önemli:</strong> Cayma hakkı, tüketicinin korunması amacıyla yasal bir haktır ve herhangi bir gerekçe gösterilmesine gerek yoktur.</p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Sanayice'nin Rolü</h2>
            <div className="space-y-4 text-gray-700">
              <p>Sanayice, iptal ve iade süreçlerinde alıcı ve satıcılar arasında aracı görevi görür. Tüm süreçlerde, platformun kullanıcıları bilgilendirme ve yönlendirme yetkisi saklıdır.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Platform Yükümlülükleri:</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Güvenli ödeme ve iade sistemi sağlamak</li>
                  <li>Kullanıcıları bilgilendirmek ve yönlendirmek</li>
                  <li>Anlaşmazlıklarda arabuluculuk yapmak</li>
                  <li>Yasal düzenlemelere uyumu sağlamak</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. İletişim ve Destek</h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Müşteri Hizmetleri</h3>
                  <p className="text-sm text-blue-700">İptal ve iade süreçlerinizde yardım almak için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Platform Desteği</h3>
                  <p className="text-sm text-green-700">Teknik sorunlar için platform destek ekibimiz 7/24 hizmetinizdedir.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Değişiklik ve Güncellemeler</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Sanayice, yasal değişiklikler veya platform geliştirmeleri nedeniyle bu koşulları güncelleme hakkını saklı tutar. Önemli değişiklikler kullanıcılara bildirilir.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Sorularınız mı var?</h2>
            <p className="text-gray-300 mb-6">İptal ve iade süreçlerinizde herhangi bir sorunuz varsa, size yardımcı olmaktan mutluluk duyarız.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition-colors font-medium">
                İletişime Geç
              </a>
              <a href="/faq" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg text-white transition-colors font-medium">
                Sık Sorulan Sorular
              </a>
            </div>
          </section>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Bu sayfa son olarak 20 Ekim 2025 tarihinde güncellenmiştir.</p>
          <p className="mt-2">© 2025 Sanayice. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
};
export default ReturnPolicy;