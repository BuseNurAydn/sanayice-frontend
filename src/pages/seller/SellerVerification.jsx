import { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Clock, Building, Download, MapPin, FileText,AlertTriangle} from 'lucide-react';
import AdminText from '../../shared/Text/AdminText';
import { toast } from 'react-toastify';
import { API_BASE } from "../../config";

const SellerVerification = () => {
  const [filtreliSaticilar, setFiltreliSaticilar] = useState([]);
  const [secilenSatici, setSecilenSatici] = useState(null);
  const [aramaTermi, setAramaTermi] = useState('');
  const [durumFiltresi, setDurumFiltresi] = useState('TUMU');
  const [modalAcik, setModalAcik] = useState(false);
  const [onayDialog, setOnayDialog] = useState({ acik: false, tip: null, saticiId: null });
  const [dogrulamaSonuclari, setDogrulamaSonuclari] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);

  const [verifications, setVerifications] = useState([]);
  const yuklenmisBelgeler = secilenSatici?.documents?.filter(b => b.fileName);
  const [redGerekcesi, setRedGerekcesi] = useState("");
  const [belgeModalAcik, setBelgeModalAcik] = useState(false);
  const [secilenBelge, setSecilenBelge] = useState(null);
  const DOCUMENT_API = `${API_BASE}/managers/seller-verifications`;

  const fetchVerifications = async () => {
    try {
      const res = await fetch(DOCUMENT_API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) throw new Error("Veriler getirilemedi");

      const data = await res.json();
      setVerifications(data);
      console.log(data)
    } catch (err) {
      console.error(err);
      toast("Satıcı doğrulama verileri alınamadı");
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);


  useEffect(() => {
    let filtrelenmis = verifications;

    if (aramaTermi) {
      filtrelenmis = filtrelenmis.filter(satici =>
        satici.companyName?.toLowerCase().includes(aramaTermi.toLowerCase()) ||
        satici.sellerName?.toLowerCase().includes(aramaTermi.toLowerCase()) ||
        satici.email?.toLowerCase().includes(aramaTermi.toLowerCase())
      );
    }
    if (durumFiltresi !== 'TUMU') {
      filtrelenmis = filtrelenmis.filter(satici => satici.status === durumFiltresi);
    }
    setFiltreliSaticilar(filtrelenmis);
  }, [aramaTermi, durumFiltresi, verifications]);


  const getDurumRozeti = (documents) => {
    const statusList = documents.map(d => d.status);
    const loadedDocumentsCount = documents.filter(d => d.fileName).length;

    // Tüm belgeler yüklendi mi? (4 belge)
    const tumBelgelerYuklendi = loadedDocumentsCount === 4;

    // En az bir belge reddedildiyse
    if (statusList.includes("REDDEDILDI")) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
          <X className="w-4 h-4 mr-1" />
          Reddedildi
        </span>
      );
    }
    // Tüm belgeler yüklendiyse ve tümü ONAYLANDI ise
    else if (tumBelgelerYuklendi && statusList.every(s => s === "ONAYLANDI")) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
          <Check className="w-4 h-4 mr-1" />
          Onaylandı
        </span>
      );
    }
    // Diğer durumlar (eksik belge ya da inceleme)
    else {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
          <Clock className="w-4 h-4 mr-1" />
          İncelemede
        </span>
      );
    }
  };

  const belgeyiGoruntule = (belge) => {
    setSecilenBelge(belge);
    setBelgeModalAcik(true);
  };

  const detaylariGoster = (satici) => {
    setSecilenSatici(satici);
    setModalAcik(true);
    dogrulamaSimulasyonu(satici);
  };

  const dogrulamaSimulasyonu = async (satici) => {
    setYukleniyor(true);
    setTimeout(() => {
      setDogrulamaSonuclari({
        odalar: {
          durum: satici.durum !== 'REDDEDILDI',
          mesaj: satici.durum !== 'REDDEDILDI' ? 'Ticaret Odası kayıtları doğrulandı' : 'Oda kayıtlarında uyumsuzluk tespit edildi'
        },
        mersis: {
          durum: satici.durum !== 'REDDEDILDI',
          mesaj: satici.durum !== 'REDDEDILDI' ? 'MERSİS kaydı onaylandı' : 'MERSİS numarası bulunamadı'
        },
        vergi: {
          durum: satici.durum !== 'REDDEDILDI',
          mesaj: satici.durum !== 'REDDEDILDI' ? 'Vergi kaydı aktif' : 'Vergi numarası doğrulaması başarısız'
        }
      });
      setYukleniyor(false);
    }, 1500);
  };

  const onayla = (documentId, managerId) => {
    setOnayDialog({ acik: true, tip: 'onayla', saticiId: documentId, managerId });
  };

  const eylemiOnayla = async () => {
    const { tip, saticiId, managerId } = onayDialog;

    if (tip !== 'onayla') {
      setOnayDialog({ acik: false, tip: null, saticiId: null });
      return;
    }

    try {
      setYukleniyor(true);

      const response = await fetch(`${API_BASE}/managers/documents/${saticiId}/review?managerId=${managerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: "ONAYLANDI" })
      });

      const data = await response.json();
      console.log("PUT status:", response.status);
      console.log("PUT response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Onaylama başarısız oldu.');
      }

      toast.success("Başarıyla onaylandı.");
      setOnayDialog({ acik: false, tip: null, saticiId: null });
      setModalAcik(false);
      fetchVerifications(); // Listeyi güncelle
    } catch (err) {
      console.error("Onaylama hatası:", err.message);
      toast.error(err.message);
    } finally {
      setYukleniyor(false);
    }
  };

  const reddet = (documentId, managerId) => {
    console.log("reddet fonksiyonuna gelen documentId:", documentId);
    setOnayDialog({ acik: true, tip: 'reddet', saticiId: documentId, managerId });
  };

  const eylemiReddet = async (documentId, rejectionReason) => {
    const { tip, saticiId, managerId } = onayDialog;

    if (!documentId) {
      toast.error("Belge ID'si bulunamadı.");
      return;
    }

    if (!rejectionReason || rejectionReason.trim() === "") {
      toast.error("Lütfen reddetme gerekçesini giriniz.");
      return;
    }

    try {
      setYukleniyor(true);

      const response = await fetch(`${API_BASE}/managers/documents/${saticiId}/review?managerId=${managerId || 1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: "REDDEDILDI",
          rejectionReason: redGerekcesi
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Reddetme işlemi başarısız oldu.');
      }

      toast.success("Başarıyla reddedildi.");
      setOnayDialog({ acik: false, tip: null, saticiId: null });
      setRedGerekcesi("");
      setModalAcik(false);
      fetchVerifications(); // Listeyi güncelle
    } catch (err) {
      console.error("Reddetme hatası:", err.message);
      toast.error(err.message);
    } finally {
      setYukleniyor(false);
    }
  };

  const getBelgeDurumu = (dogrulandi) => {
    if (dogrulandi === null) return <Clock className="w-4 h-4 text-amber-500" />;
    if (dogrulandi === true) return <Check className="w-4 h-4 text-green-500" />;
    return <X className="w-4 h-4 text-red-500" />;
  };

  const istatistikler = {
  beklemede: verifications.filter(satici => {
    const statusList = satici.documents.map(d => d.status);
    const loadedCount = satici.documents.filter(d => d.fileName).length;
    const allApproved = statusList.every(s => s === "ONAYLANDI");

    return !statusList.includes("REDDEDILDI") && (!allApproved || loadedCount < 4);
  }).length,

  onaylandi: verifications.filter(satici => {
    const statusList = satici.documents.map(d => d.status);
    const loadedCount = satici.documents.filter(d => d.fileName).length;

    return loadedCount === 4 && statusList.every(s => s === "ONAYLANDI");
  }).length,

  reddedildi: verifications.filter(satici => {
    const statusList = satici.documents.map(d => d.status);
    return statusList.includes("REDDEDILDI");
  }).length,

  toplam: verifications.length
};


  return (
    <div className="min-h-screen md:p-6 px-3 py-6 bg-gray-50">
      {/* Başlık */}
      <div className="mb-8">
        <AdminText className="text-3xl font-semibold text-gray-900">Satıcı Doğrulama</AdminText>
        <p className="mt-2 text-gray-600">Satıcı başvurularını inceleyin ve onaylayın</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Beklemede</p>
              <p className="text-3xl font-semibold text-gray-900">{istatistikler.beklemede}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Onaylandı</p>
              <p className="text-3xl font-semibold text-gray-900">{istatistikler.onaylandi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reddedildi</p>
              <p className="text-3xl font-semibold text-gray-900">{istatistikler.reddedildi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam</p>
              <p className="text-3xl font-semibold text-gray-900">{istatistikler.toplam}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Şirket, yetkili kişi veya e-posta ile arayın..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={aramaTermi}
                onChange={(e) => setAramaTermi(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={durumFiltresi}
              onChange={(e) => setDurumFiltresi(e.target.value)}
            >
              <option value="TUMU">Tüm Durumlar</option>
              <option value="BEKLEMEDE">Beklemede</option>
              <option value="ONAYLANDI">Onaylandı</option>
              <option value="REDDEDILDI">Reddedildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şirket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Bilgileri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başvuru Tarihi</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtreliSaticilar.map((satici) => (
                <tr key={satici.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{satici.companyName}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {satici.adres}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{satici.sellerName}</div>
                      <div className="text-sm text-gray-500">{satici.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">Vergi: {satici.taxId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getDurumRozeti(satici.documents)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {
                      (() => {
                        const belge = satici.documents.find(b => b.uploadDate);
                        return belge
                          ? new Date(belge.uploadDate).toLocaleDateString('tr-TR')
                          : "-";
                      })()
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => detaylariGoster(satici)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      İncele
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detay Modalı */}
      {modalAcik && secilenSatici && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{secilenSatici.sirketAdi}</h2>
                  <p className="text-sm text-gray-500 mt-1">Başvuru İncelemesi</p>
                </div>
                <button
                  onClick={() => setModalAcik(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Şirket Bilgileri */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Şirket Bilgileri</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Şirket Adı</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.companyName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Yetkili Kişi</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.sellerName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">E-posta</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Telefon</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.phoneNumber}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Yasal Bilgiler */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Yasal Bilgiler</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Vergi Numarası</label>
                        <p className="mt-1 text-sm text-gray-900">{secilenSatici.taxId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doğrulama Sonuçları */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Doğrulama Sonuçları</h3>

                    {yukleniyor ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(dogrulamaSonuclari).map(([anahtar, sonuc]) => (
                          <div key={anahtar} className={`p-4 rounded-lg border ${sonuc.durum ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center gap-2">
                              {sonuc.durum ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-sm font-medium">
                                {anahtar === 'odalar' ? 'Oda Kayıtları' : anahtar === 'mersis' ? 'MERSİS Kontrolü' : 'Vergi Doğrulama'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{sonuc.mesaj}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Belgeler */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sunulan Belgeler</h3>
                    <div className="space-y-2">
                      {yuklenmisBelgeler?.length > 0 ? (
                        yuklenmisBelgeler.map((belge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{belge.documentName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Görüntüle butonu */}
                              <button
                                onClick={() => belgeyiGoruntule(belge)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium inline-flex items-center px-2 py-1 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <Eye className="w-4 h-4 mr-1" />
                                Görüntüle
                              </button>

                              {/* Belge onay ve red butonları */}
                              {belge.status === "INCELEME" ? (
                                <>
                                  <button
                                    onClick={() => {
                                      console.log("Reddet butonunda belge.id:", belge.id);
                                      reddet(belge.id, 1);
                                    }}
                                    className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Reddet
                                  </button>
                                  <button
                                    onClick={() => onayla(belge.id, 1)}
                                    className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Onayla
                                  </button>
                                </>
                              ) : (
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-md ${belge.status === "ONAYLANDI"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                                >
                                  {belge.status === "ONAYLANDI" ? "Onaylandı" : "Reddedildi"}
                                </span>
                              )}

                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Yüklenmiş belge bulunmamaktadır.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Nedeni */}
              {secilenSatici.durum === 'REDDEDILDI' && secilenSatici.redNedeni && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Red Nedeni:</h4>
                  <p className="text-sm text-red-700">{secilenSatici.redNedeni}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onay Dialogu */}
      {onayDialog.acik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {onayDialog.tip === 'onayla' ? 'İşlemi Onayla' : 'Reddetme Gerekçesi'}
            </h3>

            {onayDialog.tip === 'reddet' ? (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 mb-4"
                  rows={4}
                  value={redGerekcesi}
                  onChange={(e) => setRedGerekcesi(e.target.value)}
                  placeholder="Belgede eksik bilgiler mevcut. Lütfen eksiksiz belgeyi yeniden yükleyiniz."
                />
              </>
            ) : (
              <p className="text-sm text-gray-600 mb-6">
                Bu satıcı başvurusundaki belgeyi onaylamak istediğinizden emin misiniz?
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setOnayDialog({ acik: false, tip: null, saticiId: null });
                  setRedGerekcesi("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  console.log('Dialog butonunda onayDialog.saticiId:', onayDialog.saticiId);
                  if (onayDialog.tip === 'onayla') {
                    eylemiOnayla(onayDialog.saticiId);
                  } else {
                    eylemiReddet(onayDialog.saticiId, redGerekcesi);
                  }
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${onayDialog.tip === 'onayla'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {onayDialog.tip === 'onayla' ? 'Onayla' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Görüntüleme Modal */}
      {belgeModalAcik && secilenBelge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{secilenBelge.documentName}</h2>
                <p className="text-sm text-gray-500">{secilenBelge.fileName}</p>
              </div>
              <button
                onClick={() => setBelgeModalAcik(false)}
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
                  <p className="text-sm text-gray-500 mt-1">{secilenBelge.fileName}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  İndir
                </button>
                <button
                  onClick={() => setBelgeModalAcik(false)}
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
  );
};
export default SellerVerification;