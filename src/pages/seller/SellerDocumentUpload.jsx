import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, X, Check, AlertTriangle, Eye, Download, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminText from '../../shared/Text/AdminText';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { API_BASE } from "../../config";

const SellerDocumentUpload = () => {

  const sabitBelgeler = [
    {
      id: 1,
      tip: 'ticaret_sicili',
      ad: 'Ticaret Sicil Gazetesi',
      aciklama: 'Şirketinizin ticaret sicil gazetesi'
    },
    {
      id: 2,
      tip: 'vergi_levhasi',
      ad: 'Vergi Levhası',
      aciklama: 'Vergi dairesinden alınan vergi levhası'
    },
    {
      id: 3,
      tip: 'imza_sirkuleri',
      ad: 'İmza Sirküleri',
      aciklama: 'Yetkili imza sahiplerinin imza sirküleri'
    },
    {
      id: 4,
      tip: 'faaliyet_belgesi',
      ad: 'Faaliyet Belgesi',
      aciklama: 'İş yeri açma ve çalışma ruhsatı'
    },
  ];

  // Sabit ve API belgelerini birleştiren fonksiyon
  const mergeBelgeler = (sabit, apiBelgeler) => {
    return sabit.map(sabitBelge => {
      const apiBelge = apiBelgeler.find(apiB =>
        apiB.documentType.toLowerCase() === sabitBelge.tip.toLowerCase()
      );
      if (apiBelge) {
        return {
          ...sabitBelge,
          belgeGercekId: apiBelge.id,
          dosyaAdi: apiBelge.fileName,
          durum: apiBelge.status,
          yuklenmeTarihi: apiBelge.uploadDate,
          boyut: apiBelge.fileSizeFormatted,
          aciklama: apiBelge.description || sabitBelge.aciklama,
          redNedeni: apiBelge.redReason || null,
        };
      }
      return {
        ...sabitBelge,
        belgeGercekId: null,
        dosyaAdi: null,
        durum: 'BEKLIYOR',
        yuklenmeTarihi: null,
        boyut: null,
        redNedeni: null,
      };
    });
  };
  const [belgeler, setBelgeler] = useState([]);
  const [suruklemeAktif, setSuruklemeAktif] = useState(false);
  const [yuklemeDurumu, setYuklemeDurumu] = useState({});
  const [modalAcik, setModalAcik] = useState(false);
  const [secilenBelge, setSecilenBelge] = useState(null);
  const fileInputRef = useRef(null);
  const [silmeOnayAcilacakBelge, setSilmeOnayAcilacakBelge] = useState(null);
  const DOCUMENT_API = `${API_BASE}/sellers`;
  const sellerId = useSelector((state) => state.auth.user?.id);

  const fetchBelgeler = async () => {
    try {
      const res = await fetch(`${DOCUMENT_API}/${sellerId}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Belgeler getirilemedi");
      const apiBelgeler = await res.json();
      const merged = mergeBelgeler(sabitBelgeler, apiBelgeler);
      setBelgeler(merged);
    } catch (err) {
      console.error(err);
      toast("Belgeler yüklenirken hata oluştu");
    }
  };
  useEffect(() => {
    if (sellerId) fetchBelgeler();
  }, [sellerId]);

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
            İnceleme
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

  const dosyaYukle = async (dosyalar, belgeId = null, sellerId) => {
    const dosya = dosyalar[0];
    if (!dosya) return;

    // Dosya boyutu kontrolü
    if (dosya.size > 5 * 1024 * 1024) {
      toast("Dosya boyutu 5MB'dan büyük olamaz");
      return;
    }

    // Dosya tipi kontrolü
    const izinliTipler = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!izinliTipler.includes(dosya.type)) {
      toast('Sadece PDF, JPG ve PNG dosyaları yüklenebilir');
      return;
    }

    // Belge kontrolü
    const belge = belgeler.find(b => b.id === belgeId);
    if (!belge) {
      toast("Belge bulunamadı");
      return;
    }

    // FormData oluştur
    const formData = new FormData();
    formData.append('file', dosya);
    formData.append('documentType', belge.tip.toUpperCase());
    formData.append('description', belge.aciklama);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${DOCUMENT_API}/${sellerId}/documents/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      // Başarılı ise state güncelle
      setBelgeler(prev =>
        prev.map(b =>
          b.id === belgeId
            ? {
              ...b,
              dosyaAdi: dosya.name,
              durum: 'INCELEME',
              yuklenmeTarihi: new Date().toISOString().split('T')[0],
              boyut: `${(dosya.size / (1024 * 1024)).toFixed(1)} MB`,
              redNedeni: null
            }
            : b
        )
      );

      toast("Belge başarıyla yüklendi!");
      fetchBelgeler();
    } catch (error) {
      toast("Yükleme hatası: " + error.message);
    }
  };

  const dosyaKaldir = async (belgeId) => {
    const belge = belgeler.find(b => b.id === belgeId);
    if (!belge) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${DOCUMENT_API}/${sellerId}/documents/${belge.belgeGercekId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Belge silinemedi.");
      }

      // UI'yi güncelle
      setBelgeler(prev => prev.map(b =>
        b.id === belgeId
          ? {
            ...b,
            belgeGercekId: null,
            dosyaAdi: null,
            durum: 'BEKLIYOR',
            yuklenmeTarihi: null,
            boyut: null,
            redNedeni: null
          }
          : b
      ));

      toast("Belge başarıyla silindi.");
    } catch (err) {
      console.error(err);
      toast("Silme işlemi sırasında hata oluştu.");
    } finally {
      setSilmeOnayAcilacakBelge(null);
    }
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
    <div className="min-h-screen bg-gray-50 py-6 px-3 md:p-6">
      <div className="">
        {/* Başlık */}
        <div className="mb-8">
          <AdminText>Satıcı Doğrulama Belgeleri</AdminText>
          <p className="mt-2 text-gray-600 text-sm md:text-base">Satıcı hesabınızı aktifleştirmek için gerekli belgeleri yükleyin</p>
        </div>

        {/* İlerleme Kartı */}
        <div className="bg-white rounded-lg border border-gray-200 px-3 py-6 md:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-lg font-medium text-gray-900">Doğrulama İlerlemesi</h2>
            <span className="text-xs md:text-sm text-gray-600">{tamamlananBelgeler}/{toplamBelgeler} Belge Tamamlandı</span>
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


        {/* Belge Listesi */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Gerekli Belgeler</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {belgeler.map((belge) => (
              <div key={belge.id} className="px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Sol: Belge Bilgileri */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-900">
                        {belge.ad || belge.documentName}
                      </h3>
                      {getDurumRozeti(belge.durum || belge.status)}
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                      {belge.aciklama || belge.description}
                    </p>

                    {(belge.dosyaAdi || belge.fileName) && (
                      <div className="text-sm text-gray-500">
                        <span>Dosya: {belge.dosyaAdi || belge.fileName}</span>
                        {(belge.boyut || belge.fileSizeFormatted) && (
                          <span className="ml-4">
                            Boyut: {belge.boyut || belge.fileSizeFormatted}
                          </span>
                        )}
                        {(belge.yuklenmeTarihi || belge.uploadDate) && (
                          <span className="ml-4">
                            Tarih: {formatTarih(belge.yuklenmeTarihi || belge.uploadDate)}
                          </span>
                        )}
                      </div>
                    )}

                    {(belge.durum === "REDDEDILDI" ||
                      belge.status === "REDDEDILDI") &&
                      (belge.redNedeni || belge.redReason) && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">
                                Red Nedeni:
                              </p>
                              <p className="text-sm text-red-700">
                                {belge.redNedeni || belge.redReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Sağ veya Mobilde Altta: Butonlar */}
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    {(belge.dosyaAdi || belge.fileName) ? (
                      <>
                        <button
                          onClick={() => belgeyiGoruntule(belge)}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Görüntüle
                        </button>
                        <button
                          onClick={() => setSilmeOnayAcilacakBelge(belge)}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Kaldır
                        </button>
                      </>
                    ) : (
                      <div
                        className={`border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer w-full md:w-auto`}
                        onDragOver={suruklemeBaslat}
                        onDragLeave={suruklemeBitir}
                        onDrop={(e) => dosyaBirak(e, belge.id)}
                        onClick={() => {
                          if (!sellerId) {
                            alert("Seller ID bulunamadı");
                            return;
                          }
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.jpg,.jpeg,.png";
                          input.onchange = (e) =>
                            dosyaYukle(e.target.files, belge.id, sellerId);
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
                {Object.entries(yuklemeDurumu).map(([id, progress]) =>
                  id === String(belge.id) ? (
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
                  ) : null
                )}
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
        {silmeOnayAcilacakBelge && (
          <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Belgeyi silmek istiyor musunuz?</h3>
              <p className="text-sm text-gray-600 mb-6">
                <strong>{silmeOnayAcilacakBelge.dosyaAdi || silmeOnayAcilacakBelge.documentName}</strong> adlı belge kalıcı olarak silinecektir.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSilmeOnayAcilacakBelge(null)}
                  className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => dosyaKaldir(silmeOnayAcilacakBelge.id)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );

};
export default SellerDocumentUpload;