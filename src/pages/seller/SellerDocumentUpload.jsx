import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check, AlertTriangle, Eye, Download, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';

const SellerDocumentUpload = () => {
  const [belgeler, setBelgeler] = useState([
    {
      id: 1,
      tip: 'ticaret_sicili',
      ad: 'Ticaret Sicil Gazetesi',
      dosyaAdi: 'ticaret_sicili.pdf',
      durum: 'ONAYLANDI',
      yuklenmeTarihi: '2025-01-15',
      boyut: '2.4 MB',
      aciklama: 'Şirketinizin ticaret sicil gazetesi'
    },
    {
      id: 2,
      tip: 'vergi_levhasi',
      ad: 'Vergi Levhası',
      dosyaAdi: null,
      durum: 'BEKLIYOR',
      yuklenmeTarihi: null,
      boyut: null,
      aciklama: 'Vergi dairesinden alınan vergi levhası'
    },
    {
      id: 3,
      tip: 'imza_sirküleri',
      ad: 'İmza Sirküleri',
      dosyaAdi: 'imza_sirkuleri.pdf',
      durum: 'INCELEME',
      yuklenmeTarihi: '2025-01-18',
      boyut: '1.8 MB',
      aciklama: 'Yetkili imza sahiplerinin imza sirküleri'
    },
    {
      id: 4,
      tip: 'faaliyet_belgesi',
      ad: 'Faaliyet Belgesi',
      dosyaAdi: 'faaliyet_belgesi.pdf',
      durum: 'REDDEDILDI',
      yuklenmeTarihi: '2025-01-12',
      boyut: '3.1 MB',
      redNedeni: 'Belge süresinin dolmuş olması',
      aciklama: 'İş yeri açma ve çalışma ruhsatı'
    }
  ]);

  const [suruklemeAktif, setSuruklemeAktif] = useState(false);
  const [yuklemeDurumu, setYuklemeDurumu] = useState({});
  const [modalAcik, setModalAcik] = useState(false);
  const [secilenBelge, setSecilenBelge] = useState(null);
  const fileInputRef = useRef(null);

  const getDurumRozeti = (durum) => {
    switch (durum) {
      case 'BEKLIYOR':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Belge Bekleniyor
          </span>
        );
      case 'INCELEME':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <RefreshCw className="w-3 h-3 mr-1" />
            İnceleme Aşamasında
          </span>
        );
      case 'ONAYLANDI':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Onaylandı
          </span>
        );
      case 'REDDEDILDI':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  const dosyaYukle = (dosyalar, belgeId = null) => {
    const dosya = dosyalar[0];
    if (!dosya) return;

    // Dosya boyutu kontrolü (5MB)
    if (dosya.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan büyük olamaz');
      return;
    }

    // Dosya tipi kontrolü
    const izinliTipler = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!izinliTipler.includes(dosya.type)) {
      alert('Sadece PDF, JPG ve PNG dosyaları yüklenebilir');
      return;
    }

    const hedefBelge = belgeId ? belgeler.find(b => b.id === belgeId) : null;
    
    // Yükleme simülasyonu
    const yuklemeTakipId = Date.now();
    setYuklemeDurumu(prev => ({ ...prev, [yuklemeTakipId]: 0 }));

    const interval = setInterval(() => {
      setYuklemeDurumu(prev => {
        const yeniDurum = (prev[yuklemeTakipId] || 0) + 10;
        if (yeniDurum >= 100) {
          clearInterval(interval);
          
          // Belgeyi güncelle
          setBelgeler(prev => prev.map(belge => 
            belge.id === (belgeId || hedefBelge?.id) ? {
              ...belge,
              dosyaAdi: dosya.name,
              durum: 'INCELEME',
              yuklenmeTarihi: new Date().toISOString().split('T')[0],
              boyut: `${(dosya.size / (1024 * 1024)).toFixed(1)} MB`
            } : belge
          ));

          // Yükleme durumunu temizle
          setTimeout(() => {
            setYuklemeDurumu(prev => {
              const yeni = { ...prev };
              delete yeni[yuklemeTakipId];
              return yeni;
            });
          }, 1000);
          
          return { ...prev, [yuklemeTakipId]: 100 };
        }
        return { ...prev, [yuklemeTakipId]: yeniDurum };
      });
    }, 100);
  };

  const dosyaKaldir = (belgeId) => {
    setBelgeler(prev => prev.map(belge => 
      belge.id === belgeId ? {
        ...belge,
        dosyaAdi: null,
        durum: 'BEKLIYOR',
        yuklenmeTarihi: null,
        boyut: null,
        redNedeni: null
      } : belge
    ));
  };

  const belgeyiGoruntule = (belge) => {
    setSecilenBelge(belge);
    setModalAcik(true);
  };

  const suruklemeBaslat = (e) => {
    e.preventDefault();
    setSuruklemeAktif(true);
  };

  const suruklemeBitir = (e) => {
    e.preventDefault();
    setSuruklemeAktif(false);
  };

  const dosyaBirak = (e, belgeId = null) => {
    e.preventDefault();
    setSuruklemeAktif(false);
    const dosyalar = Array.from(e.dataTransfer.files);
    dosyaYukle(dosyalar, belgeId);
  };

  const formatTarih = (tarih) => {
    if (!tarih) return '-';
    return new Date(tarih).toLocaleDateString('tr-TR');
  };

  const tamamlananBelgeler = belgeler.filter(b => b.durum === 'ONAYLANDI').length;
  const toplamBelgeler = belgeler.length;
  const bekleyenBelgeler = belgeler.filter(b => b.durum === 'BEKLIYOR').length;
  const reddedilenBelgeler = belgeler.filter(b => b.durum === 'REDDEDILDI').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Satıcı Doğrulama Belgeleri</h1>
          <p className="mt-2 text-gray-600">Satıcı hesabınızı aktifleştirmek için gerekli belgeleri yükleyin</p>
        </div>

        {/* İlerleme Kartı */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Doğrulama İlerlemesi</h2>
            <span className="text-sm text-gray-600">{tamamlananBelgeler}/{toplamBelgeler} Belge Tamamlandı</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(tamamlananBelgeler / toplamBelgeler) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-semibold text-green-600">{tamamlananBelgeler}</div>
              <div className="text-sm text-green-700">Onaylanan</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-semibold text-amber-600">{bekleyenBelgeler}</div>
              <div className="text-sm text-amber-700">Bekleyen</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-semibold text-red-600">{reddedilenBelgeler}</div>
              <div className="text-sm text-red-700">Reddedilen</div>
            </div>
          </div>
        </div>

        {/* Yükleme Alanı */}
        <div className="mb-8">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              suruklemeAktif ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
            onDragOver={suruklemeBaslat}
            onDragLeave={suruklemeBitir}
            onDrop={(e) => dosyaBirak(e)}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belge Yükleyin</h3>
            <p className="text-gray-600 mb-4">
              Dosyaları buraya sürükleyin veya tıklayarak seçin
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => dosyaYukle(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Upload className="w-4 h-4 mr-2" />
              Dosya Seç
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Desteklenen formatlar: PDF, JPG, PNG (Maksimum 5MB)
            </p>
          </div>
        </div>

        {/* Belge Listesi */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Gerekli Belgeler</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {belgeler.map((belge) => (
              <div key={belge.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-900">{belge.ad}</h3>
                      {getDurumRozeti(belge.durum)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{belge.aciklama}</p>
                    
                    {belge.dosyaAdi && (
                      <div className="text-sm text-gray-500">
                        <span>Dosya: {belge.dosyaAdi}</span>
                        {belge.boyut && <span className="ml-3">Boyut: {belge.boyut}</span>}
                        {belge.yuklenmeTarihi && <span className="ml-3">Tarih: {formatTarih(belge.yuklenmeTarihi)}</span>}
                      </div>
                    )}

                    {belge.durum === 'REDDEDILDI' && belge.redNedeni && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Red Nedeni:</p>
                            <p className="text-sm text-red-700">{belge.redNedeni}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {belge.dosyaAdi ? (
                      <>
                        <button
                          onClick={() => belgeyiGoruntule(belge)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Görüntüle
                        </button>
                        <button
                          onClick={() => dosyaKaldir(belge.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Kaldır
                        </button>
                      </>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                        onDragOver={suruklemeBaslat}
                        onDragLeave={suruklemeBitir}
                        onDrop={(e) => dosyaBirak(e, belge.id)}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.jpg,.jpeg,.png';
                          input.onchange = (e) => dosyaYukle(e.target.files, belge.id);
                          input.click();
                        }}
                      >
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 text-center">Belge Yükle</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yükleme Durumu */}
                {Object.entries(yuklemeDurumu).map(([id, progress]) => (
                  <div key={id} className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Yükleniyor...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Önemli Bilgiler</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tüm belgeler PDF, JPG veya PNG formatında olmalıdır</li>
                <li>• Dosya boyutu 5MB'ı geçmemelidir</li>
                <li>• Belgeler net ve okunabilir olmalıdır</li>
                <li>• İnceleme süreci 2-3 iş günü sürebilir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Görüntüleme Modal */}
        {modalAcik && secilenBelge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{secilenBelge.ad}</h2>
                  <p className="text-sm text-gray-500">{secilenBelge.dosyaAdi}</p>
                </div>
                <button
                  onClick={() => setModalAcik(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belge Önizlemesi</p>
                    <p className="text-sm text-gray-500 mt-1">{secilenBelge.dosyaAdi}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    İndir
                  </button>
                  <button
                    onClick={() => setModalAcik(false)}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDocumentUpload;