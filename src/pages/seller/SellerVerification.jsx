import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Clock, Building, Phone, Mail, MapPin, FileText, Shield, AlertTriangle, MoreVertical, Filter } from 'lucide-react';
import AdminText from '../../shared/Text/AdminText';

const SellerVerification = () => {
  const [saticilar, setSaticilar] = useState([]);
  const [filtreliSaticilar, setFiltreliSaticilar] = useState([]);
  const [secilenSatici, setSecilenSatici] = useState(null);
  const [aramaTermi, setAramaTermi] = useState('');
  const [durumFiltresi, setDurumFiltresi] = useState('TUMU');
  const [modalAcik, setModalAcik] = useState(false);
  const [onayDialog, setOnayDialog] = useState({ acik: false, tip: null, saticiId: null });
  const [dogrulamaSonuclari, setDogrulamaSonuclari] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);

  const ornekSaticilar = [
    {
      id: 1,
      sirketAdi: "TechnoVision Ltd.",
      iletisimKisi: "Ahmet Yılmaz",
      email: "a.yilmaz@technovision.com",
      telefon: "+90 212 555 0101",
      adres: "İstanbul, Şişli",
      vergiNumarasi: "1234567890",
      mersisNumarasi: "0123456789012345",
      ticaretSicilNumarasi: "12345",
      durum: "BEKLEMEDE",
      basvuruTarihi: "2025-01-15",
      belgeler: [
        { tip: "ticaret_sicili", ad: "ticaret_sicili.pdf", dogrulandi: null },
        { tip: "vergi_levhasi", ad: "vergi_levhasi.pdf", dogrulandi: null },
        { tip: "imza_sirküleri", ad: "imza_sirkuleri.pdf", dogrulandi: null }
      ]
    },
    {
      id: 2,
      sirketAdi: "Dijital Ticaret A.Ş.",
      iletisimKisi: "Fatma Demir",
      email: "f.demir@dijitalticaret.com",
      telefon: "+90 212 555 0202",
      adres: "Ankara, Çankaya",
      vergiNumarasi: "9876543210",
      mersisNumarasi: "9876543210987654",
      ticaretSicilNumarasi: "54321",
      durum: "ONAYLANDI",
      basvuruTarihi: "2025-01-12",
      onayTarihi: "2025-01-14",
      belgeler: [
        { tip: "ticaret_sicili", ad: "ticaret_sicili.pdf", dogrulandi: true },
        { tip: "vergi_levhasi", ad: "vergi_levhasi.pdf", dogrulandi: true },
        { tip: "imza_sirküleri", ad: "imza_sirkuleri.pdf", dogrulandi: true }
      ]
    },
    {
      id: 3,
      sirketAdi: "Perakende Çözümleri Ltd.",
      iletisimKisi: "Mehmet Kaya",
      email: "m.kaya@perakendecozumleri.com",
      telefon: "+90 232 555 0303",
      adres: "İzmir, Konak",
      vergiNumarasi: "5555555555",
      mersisNumarasi: "5555555555555555",
      ticaretSicilNumarasi: "98765",
      durum: "REDDEDILDI",
      basvuruTarihi: "2025-01-08",
      redNedeni: "Eksik belge sunuldu",
      redTarihi: "2025-01-10",
      belgeler: [
        { tip: "ticaret_sicili", ad: "ticaret_sicili.pdf", dogrulandi: false },
        { tip: "vergi_levhasi", ad: "vergi_levhasi.pdf", dogrulandi: null },
        { tip: "imza_sirküleri", ad: "imza_sirkuleri.pdf", dogrulandi: null }
      ]
    }
  ];

  useEffect(() => {
    setSaticilar(ornekSaticilar);
    setFiltreliSaticilar(ornekSaticilar);
  }, []);

  useEffect(() => {
    let filtrelenmis = saticilar;

    if (aramaTermi) {
      filtrelenmis = filtrelenmis.filter(satici => 
        satici.sirketAdi.toLowerCase().includes(aramaTermi.toLowerCase()) ||
        satici.iletisimKisi.toLowerCase().includes(aramaTermi.toLowerCase()) ||
        satici.email.toLowerCase().includes(aramaTermi.toLowerCase())
      );
    }

    if (durumFiltresi !== 'TUMU') {
      filtrelenmis = filtrelenmis.filter(satici => satici.durum === durumFiltresi);
    }

    setFiltreliSaticilar(filtrelenmis);
  }, [aramaTermi, durumFiltresi, saticilar]);

  const getDurumRozeti = (durum) => {
    switch (durum) {
      case 'BEKLEMEDE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">İnceleme Bekliyor</span>;
      case 'ONAYLANDI':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Onaylandı</span>;
      case 'REDDEDILDI':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Reddedildi</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Bilinmiyor</span>;
    }
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

  const onayla = (saticiId) => {
    setOnayDialog({ acik: true, tip: 'onayla', saticiId });
  };

  const reddet = (saticiId) => {
    setOnayDialog({ acik: true, tip: 'reddet', saticiId });
  };

  const eylemiOnayla = () => {
    const { tip, saticiId } = onayDialog;
    const yeniDurum = tip === 'onayla' ? 'ONAYLANDI' : 'REDDEDILDI';
    
    setSaticilar(prev => prev.map(satici => 
      satici.id === saticiId ? { ...satici, durum: yeniDurum } : satici
    ));
    
    setOnayDialog({ acik: false, tip: null, saticiId: null });
    setModalAcik(false);
  };

  const getBelgeDurumu = (dogrulandi) => {
    if (dogrulandi === null) return <Clock className="w-4 h-4 text-amber-500" />;
    if (dogrulandi === true) return <Check className="w-4 h-4 text-green-500" />;
    return <X className="w-4 h-4 text-red-500" />;
  };

  const istatistikler = {
    beklemede: saticilar.filter(s => s.durum === 'BEKLEMEDE').length,
    onaylandi: saticilar.filter(s => s.durum === 'ONAYLANDI').length,
    reddedildi: saticilar.filter(s => s.durum === 'REDDEDILDI').length,
    toplam: saticilar.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                        <div className="text-sm font-medium text-gray-900">{satici.sirketAdi}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {satici.adres}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{satici.iletisimKisi}</div>
                        <div className="text-sm text-gray-500">{satici.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">Vergi: {satici.vergiNumarasi}</div>
                        <div className="text-sm text-gray-500">Ticaret: {satici.ticaretSicilNumarasi}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDurumRozeti(satici.durum)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(satici.basvuruTarihi).toLocaleDateString('tr-TR')}
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
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                            <p className="mt-1 text-sm text-gray-900">{secilenSatici.sirketAdi}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Yetkili Kişi</label>
                            <p className="mt-1 text-sm text-gray-900">{secilenSatici.iletisimKisi}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">E-posta</label>
                            <p className="mt-1 text-sm text-gray-900">{secilenSatici.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Telefon</label>
                            <p className="mt-1 text-sm text-gray-900">{secilenSatici.telefon}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Adres</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.adres}</p>
                        </div>
                      </div>
                    </div>

                    {/* Yasal Bilgiler */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Yasal Bilgiler</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Vergi Numarası</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.vergiNumarasi}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">MERSİS Numarası</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.mersisNumarasi}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ticaret Sicil Numarası</label>
                          <p className="mt-1 text-sm text-gray-900">{secilenSatici.ticaretSicilNumarasi}</p>
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
                        {secilenSatici.belgeler.map((belge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{belge.ad}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getBelgeDurumu(belge.dogrulandi)}
                              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                Görüntüle
                              </button>
                            </div>
                          </div>
                        ))}
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

                {/* İşlemler */}
                {secilenSatici.durum === 'BEKLEMEDE' && (
                  <div className="mt-8 flex gap-3 justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() => reddet(secilenSatici.id)}
                      className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reddet
                    </button>
                    <button
                      onClick={() => onayla(secilenSatici.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Onayla
                    </button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">İşlemi Onayla</h3>
              <p className="text-sm text-gray-600 mb-6">
                Bu satıcı başvurusunu {onayDialog.tip === 'onayla' ? 'onaylamak' : 'reddetmek'} istediğinizden emin misiniz?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setOnayDialog({ acik: false, tip: null, saticiId: null })}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={eylemiOnayla}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    onayDialog.tip === 'onayla' 
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
      </div>
    </div>
  );
};

export default SellerVerification;