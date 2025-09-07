import { useState, useEffect, useRef } from 'react';
import { Upload, X, AlertTriangle, Eye, Download, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { FiAlertCircle } from "react-icons/fi";
import { GoFile } from "react-icons/go";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
          incelemeTarihi: apiBelge.reviewDate,
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
        incelemeTarihi: null,
        boyut: null,
        redNedeni: null,
      };
    });
  };
  const [belgeler, setBelgeler] = useState([]);
  const [suruklemeAktif, setSuruklemeAktif] = useState(false);
  const [modalAcik, setModalAcik] = useState(false);
  const [secilenBelge, setSecilenBelge] = useState(null);
  const [seciliDosya, setSeciliDosya] = useState(null);
  const [belgeYukleModalAcik, setBelgeYukleModalAcik] = useState(false);
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
      console.log(apiBelgeler)
    } catch (err) {
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
              incelemeTarihi: new Date().toISOString().split('T')[0],
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
            incelemeTarihi: null,
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

  const oran = toplamBelgeler > 0 ? Math.round((tamamlananBelgeler / toplamBelgeler) * 100) : 0;
  const eksikVar = tamamlananBelgeler < toplamBelgeler;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 md:p-6">
      <div className="">
        {/* Başlık */}
        <div className="mb-8">
          <AdminText>Satıcı Doğrulama Belgeleri</AdminText>
          <p className="mt-2 text-gray-600 text-sm md:text-base">Satıcı hesabınızı aktifleştirmek için gerekli belgeleri yükleyin</p>
        </div>

        <div className="space-y-6 py-4">
          {/* Üst Kart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-6">
              {/* Sol: Dairesel Progress */}
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={oran}
                  text={`%${oran}`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: "#FC8A06",
                    textColor: "#111827",
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>

              {/* Sağ: Duruma göre içerik */}
              <div className="flex-1 flex justify-between items-center">
                {eksikVar ? (
                  <>
                    <div>
                      <h2 className="text-base md:text-lg font-medium text-gray-900 mb-1">
                        Satış yapabilmek için eksik bilgilerinizi tamamlayın.
                      </h2>
                      <p className="text-sm text-gray-600">
                        Tamamlamanız gereken{" "}
                        <span className="font-semibold">{toplamBelgeler - tamamlananBelgeler}</span> zorunlu belgeniz bulunmaktadır.
                      </p>
                    </div>

                    <button className="inline-flex items-center px-3 py-2 bg-[var(--color-orange)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-dark-orange)] cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Eksik evrakları yükleyiniz
                    </button>
                  </>
                ) : (
                  <h2 className="text-base md:text-lg font-semibold text-green-600">
                    Tüm evrakları başarılı bir şekilde yüklediniz !
                  </h2>
                )}
              </div>
            </div>

            {/* Alt kısım: İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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

          {/**Tablo */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gerekli Belgeler</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Evrak Adı", "Oluşturulma Tarihi", "İnceleme Tarihi", "Yüklenen Belge", "Durum", "İşlemler"].map((head) => (
                      <th key={head} className="px-4 py-3 text-left text-sm font-medium text-gray-800">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {belgeler.map((belge) => {
                    const belgeAdi = belge.ad || belge.documentName || "-";
                    const yuklenmeTarihi = belge.yuklenmeTarihi
                      ? formatTarih(belge.yuklenmeTarihi)
                      : "-";
                    const incelemeTarihi = belge.incelemeTarihi
                      ? formatTarih(belge.incelemeTarihi)
                      : "-";
                    const yuklenenBelge = belge.dosyaAdi || belge.fileName || "-";
                    const durum = belge.durum || belge.status || "BELGE BEKLENİYOR";

                    return (
                      <tr key={belge.id}>
                        <td className="px-4 py-3 text-gray-900">{belgeAdi}</td>
                        <td className="px-4 py-3 text-gray-600">{yuklenmeTarihi}</td>
                        <td className="px-4 py-3 text-gray-600">{incelemeTarihi}</td>
                        <td className="px-4 py-3 text-gray-600">{yuklenenBelge}</td>
                        <td className="px-4 py-3">
                          {getDurumRozeti(durum)}
                        </td>

                        {/* İşlemler */}
                        <td className="px-4 py-3">
                          {yuklenenBelge !== "-" ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => belgeyiGoruntule(belge)}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />Görüntüle
                              </button>
                              <button
                                onClick={() => setSilmeOnayAcilacakBelge(belge)}
                                className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" /> Kaldır
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSecilenBelge(belge);
                                setBelgeYukleModalAcik(true);
                              }}
                              className="flex justify-center gap-x-2 px-2 py-1 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-50"
                            >
                              <Upload className='w-4 h-4' />
                              Belge Yükle
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Belge Yükleme Modal */}
                {belgeYukleModalAcik && secilenBelge && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-lg">

                      <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">{secilenBelge.ad}</h2>
                        <button
                          onClick={() => setBelgeYukleModalAcik(false)}
                          className="text-gray-400 hover:text-gray-600 text-xl"
                        >  X
                        </button>
                      </div>

                      {/* Açıklama */}
                      <div className="p-6 space-y-4">
                        <div className='text-gray-700 text-sm'>
                          <p className="flex items-center gap-x-2"> <FiAlertCircle />{secilenBelge.aciklama}</p>
                          <p className="flex items-center gap-x-2">
                            <FiAlertCircle /> Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          </p>
                          <p className="flex items-start gap-x-2">
                            <FiAlertCircle /> Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                          </p>
                        </div>

                        {/* Dosya seçme */}
                        <div
                          className={`border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer w-full md:w-auto`}
                          onDragOver={suruklemeBaslat}
                          onDragLeave={suruklemeBitir}
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            setSeciliDosya(files[0]);
                          }}
                          onClick={() => {
                            if (!sellerId) {
                              alert("Seller ID bulunamadı");
                              return;
                            }
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.jpg,.jpeg,.png";
                            input.onchange = (e) => setSeciliDosya(e.target.files[0]);
                            input.click();
                          }}
                        >
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 text-center">Dosya Seç</p>
                        </div>
                        {seciliDosya && (
                          <p className="text-sm text-gray-700 text-center mt-2">Seçilen dosya: {seciliDosya.name}</p>
                        )}

                        {/* Onaya Gönder */}
                        <button
                          onClick={() => {
                            if (!seciliDosya) {
                              alert("Lütfen önce bir dosya seçin");
                              return;
                            }

                            dosyaYukle([seciliDosya], secilenBelge.id, sellerId);

                            // güncelleme
                            setBelgeler(prev =>
                              prev.map(b =>
                                b.id === secilenBelge.id
                                  ? {
                                    ...b,
                                    dosyaAdi: seciliDosya.name,
                                    durum: 'INCELEME',
                                    yuklenmeTarihi: new Date().toISOString().split('T')[0],
                                    incelemeTarihi: new Date().toISOString().split('T')[0],
                                  }
                                  : b
                              )
                            );
                            toast("Belge onaya gönderildi!");
                            setBelgeYukleModalAcik(false);
                            setSeciliDosya(null);
                          }}
                          className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        >
                          Onaya Gönder
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </table>
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

          {/* Modal */}
          {modalAcik && secilenBelge && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">{secilenBelge.ad}</h2>
                  <button
                    onClick={() => setModalAcik(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Açıklama */}
                  <p className="text-gray-700 text-sm">{secilenBelge.aciklama}</p>

                  {/* Dosya Seç */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => dosyaYukle(e.target.files, secilenBelge.id, sellerId)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    {secilenBelge.dosyaAdi && (
                      <p className="text-sm text-gray-600 mt-2">Seçili dosya: {secilenBelge.dosyaAdi}</p>
                    )}
                  </div>

                  {/* Onaya Gönder */}
                  <button
                    onClick={() => {
                      if (!secilenBelge.dosyaAdi) {
                        alert("Lütfen önce bir dosya seçin");
                        return;
                      }
                      // Durumu güncelle
                      setBelgeler(prev =>
                        prev.map(b =>
                          b.id === secilenBelge.id
                            ? {
                              ...b,
                              durum: 'INCELEME',
                              yuklenmeTarihi: new Date().toISOString().split('T')[0],
                              incelemeTarihi: new Date().toISOString().split('T')[0]
                            }
                            : b
                        )
                      );
                      toast("Belge onaya gönderildi!");
                      setModalAcik(false);
                    }}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Onaya Gönder
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Sözleşme Modal */}
          {modalAcik && secilenBelge && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900"> Sanayice satıcı üyelik sözleşmesi</h2>
                  <button
                    onClick={() => setModalAcik(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Açıklama */}
                  <div>
                    <p className="text-gray-700 text-sm mb-2 flex items-center gap-x-2">
                      <FiAlertCircle /> Sanayice satıcı üyelik sözleşmesini sözleşmeyi indir butonuna tıklayarak inceleyin.
                    </p>
                    <p className="text-gray-600 text-sm flex items-start gap-x-2">
                      <FiAlertCircle /> Sözleşmeyi dikkatlice okuduktan ve tüm şartları kabul ettikten sonra onayla butonuna tıklayarak onaylayın.
                    </p>
                  </div>

                  {/* Evrak Bilgisi Kartı */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between">
                    <p className="text-sm text-gray-800 font-medium flex items-center gap-2"><GoFile />{secilenBelge.dosyaAdi}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      İnceleme Tarihi: {new Date(secilenBelge.incelemeTarihi || "-").toLocaleDateString()}
                    </p>
                    <p>{getDurumRozeti(secilenBelge.durum)}</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-800 font-medium flex items-center gap-2">
                      <GoFile/>
                      <a
                        href="/satici_sozlesmesi.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Satıcı Üyelik Sözleşmesi.pdf
                      </a>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3">
                    <a
                      href="/satici_sozlesmesi.pdf"
                      download="Üyelik_Sözleşmesi.pdf"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Sözleşmeyi İndir
                    </a>
                    <button
                      onClick={() => {
                        toast("Sözleşme onaylandı!");
                        setModalAcik(false);
                      }}
                      className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-[var(--color-orange)] hover:bg-[var(--color-dark-orange)] cursor-pointer"
                    >
                      Onayla
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
                  >Vazgeç
                  </button>
                  <button
                    onClick={() => dosyaKaldir(silmeOnayAcilacakBelge.id)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  > Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SellerDocumentUpload;