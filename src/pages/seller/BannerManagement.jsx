import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, BarChart3, Calendar, Link, FileImage, Type, Mouse } from "lucide-react";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    buttonText: "",
    isActive: true,
    order: 1
  });

  // Mock data
  useEffect(() => {
    setBanners([
      {
        id: 1,
        title: "Yaz İndirimleri",
        description: "Tüm ürünlerde %50'ye varan indirimler",
        imageUrl: "https://bgcp.bionluk.com/images/portfolio/1400x788/190301b7-78b5-486b-aa03-44623ea93017.jpg",
        linkUrl: "/sale",
        buttonText: "Hemen Keşfet",
        isActive: true,
        order: 1,
        createdAt: "2024-06-01"
      },
      {
        id: 2,
        title: "Yeni Koleksiyon",
        description: "2024 Sonbahar koleksiyonu artık mağazalarda",
        imageUrl: "https://imannoor.com/Data/EditorFiles/video/agustos2024/yaz-indirimi.png",
        linkUrl: "/collection/fall-2024",
        buttonText: "Koleksiyonu İncele",
        isActive: true,
        order: 2,
        createdAt: "2024-05-15"
      },
      {
        id: 3,
        title: "Ücretsiz Kargo",
        description: "150 TL üzeri tüm siparişlerde ücretsiz kargo",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiMfquKIHRNNy2wGCyq_Lu-y63UgLRhWMHQw&s",
        linkUrl: "/shipping-info",
        buttonText: "Detayları Gör",
        isActive: false,
        order: 3,
        createdAt: "2024-04-20"
      }
    ]);
  }, []);

  const showToast = (message, type = 'success') => {
    // Toast notification placeholder
    console.log(`${type}: ${message}`);
  };

  const saveBanner = async (bannerData) => {
    if (editingId) {
      setBanners(prev => prev.map(banner => 
        banner.id === editingId ? { ...banner, ...bannerData } : banner
      ));
      showToast("Banner güncellendi!");
    } else {
      const newBanner = {
        ...bannerData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBanners(prev => [...prev, newBanner]);
      showToast("Banner eklendi!");
    }
  };

  const deleteBanner = async (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    showToast("Banner silindi!");
  };

  const toggleBannerStatus = async (id) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
    ));
    showToast("Banner durumu güncellendi!");
  };

  const handleAdd = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      buttonText: "",
      isActive: true,
      order: banners.length + 1
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      buttonText: banner.buttonText,
      isActive: banner.isActive,
      order: banner.order
    });
    setEditingId(banner.id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      showToast("Başlık ve görsel URL'i zorunludur!", 'error');
      return;
    }

    try {
      await saveBanner(formData);
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      showToast("Banner kaydedilirken hata oluştu!", 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBanner(deleteId);
      setShowConfirmDialog(false);
      setDeleteId(null);
    } catch (error) {
      showToast("Banner silinirken hata oluştu!", 'error');
    }
  };

  const activeBanners = banners.filter(b => b.isActive);
  const inactiveBanners = banners.filter(b => !b.isActive);

  const getFilteredBanners = () => {
    switch(activeTab) {
      case 'active': return activeBanners;
      case 'inactive': return inactiveBanners;
      default: return banners;
    }
  };

  const BannerCard = ({ banner, isActive }) => (
    <div className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!isActive ? 'opacity-60' : ''}`}>
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={banner.imageUrl} 
          alt={banner.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${!isActive ? 'grayscale' : ''}`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x300/e2e8f0/64748b?text=Görsel+Yüklenemedi";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {isActive ? 'Aktif' : 'Pasif'}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/30 text-white backdrop-blur-sm">
            #{banner.order}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{banner.title}</h3>
          <p className="text-white/90 text-sm line-clamp-2">{banner.description}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3 mb-4">
          {banner.linkUrl && (
            <div className="flex items-center gap-2 text-gray-600">
              <Link className="w-4 h-4" />
              <span className="text-sm truncate">{banner.linkUrl}</span>
            </div>
          )}
          {banner.buttonText && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mouse className="w-4 h-4" />
              <span className="text-sm">{banner.buttonText}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{banner.createdAt}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(banner)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Düzenle
          </button>
          <button
            onClick={() => toggleBannerStatus(banner.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
              isActive 
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isActive ? 'Pasifleştir' : 'Aktifleştir'}
          </button>
          <button
            onClick={() => {
              setDeleteId(banner.id);
              setShowConfirmDialog(true);
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner Yönetimi</h1>
            <p className="text-gray-600">Web sitenizin banner içeriklerini yönetin</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Yeni Banner
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Toplam Banner</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{banners.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Aktif Banner</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeBanners.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pasif Banner</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{inactiveBanners.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8">
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'Tümü', count: banners.length },
              { key: 'active', label: 'Aktif', count: activeBanners.length },
              { key: 'inactive', label: 'Pasif', count: inactiveBanners.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {getFilteredBanners()
            .sort((a, b) => a.order - b.order)
            .map((banner) => (
              <BannerCard 
                key={banner.id} 
                banner={banner} 
                isActive={banner.isActive}
              />
            ))}
        </div>

        {getFilteredBanners().length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Banner Bulunmuyor</h3>
            <p className="text-gray-600">Bu kategoride henüz banner bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Banner Güncelle" : "Yeni Banner Ekle"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Type className="w-4 h-4" />
                      Başlık *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Banner başlığı"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mouse className="w-4 h-4" />
                      Buton Metni
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Hemen Keşfet, İncele vb."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows="3"
                    placeholder="Banner açıklaması"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileImage className="w-4 h-4" />
                    Görsel URL *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://example.com/banner.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={formData.imageUrl}
                          alt="Önizleme"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Link className="w-4 h-4" />
                    Link URL
                  </label>
                  <input
                    type="url"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Banner tıklandığında gidilecek sayfa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sıra
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      min="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Aktif</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingId ? "Güncelle" : "Kaydet"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Banner Sil</h3>
              <p className="text-gray-600 mb-6">Bu banneri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Sil
                </button>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;