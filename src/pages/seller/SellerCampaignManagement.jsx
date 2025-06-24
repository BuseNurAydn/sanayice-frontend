import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, Gift, Copy, Calendar, Percent, Users, ShoppingCart, Clock, Star, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SellerCampaignManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    minOrderAmount: "",
    isActive: true
  });

  // Mock data - Satıcının kuponları
  useEffect(() => {
    setCoupons([
      {
        id: 1,
        code: "TECHWORLD20",
        name: "Teknoloji Kuponu",
        description: "Tüm elektronik ürünlerde geçerli",
        discountType: "percentage",
        discountValue: 20,
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        usageLimit: 100,
        usedCount: 34,
        minOrderAmount: 500,
        isActive: true,
        createdAt: "2024-05-20",
        status: "active"
      },
      {
        id: 2,
        code: "YENIMAG50",
        name: "Yeni Müşteri Kuponu",
        description: "İlk alışverişinizde özel indirim",
        discountType: "fixed",
        discountValue: 50,
        startDate: "2024-05-01",
        endDate: "2024-12-31",
        usageLimit: 200,
        usedCount: 89,
        minOrderAmount: 300,
        isActive: true,
        createdAt: "2024-04-25",
        status: "active"
      },
      {
        id: 3,
        code: "LAPTOP15",
        name: "Laptop İndirimi",
        description: "Laptop kategorisinde özel fırsat",
        discountType: "percentage",
        discountValue: 15,
        startDate: "2024-04-01",
        endDate: "2024-05-31",
        usageLimit: 50,
        usedCount: 47,
        minOrderAmount: 1000,
        isActive: false,
        createdAt: "2024-03-20",
        status: "expired"
      },
      {
        id: 4,
        code: "SONBAHAR25",
        name: "Sonbahar Kampanyası",
        description: "Sonbahar sezonuna özel kupon",
        discountType: "percentage",
        discountValue: 25,
        startDate: "2024-09-01",
        endDate: "2024-11-30",
        usageLimit: 150,
        usedCount: 0,
        minOrderAmount: 400,
        isActive: false,
        createdAt: "2024-06-10",
        status: "scheduled"
      }
    ]);
  }, []);

  const showToast = (message, type = 'success') => {
    console.log(`${type}: ${message}`);
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Kupon kodu kopyalandı!");
  };

  const handleAdd = () => {
    setFormData({
      code: generateCouponCode(),
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      minOrderAmount: "",
      isActive: true
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      minOrderAmount: coupon.minOrderAmount,
      isActive: coupon.isActive
    });
    setEditingId(coupon.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.discountValue) {
      showToast("Kupon kodu, isim ve indirim miktarı zorunludur!", 'error');
      return;
    }
    
    if (editingId) {
      setCoupons(prev => prev.map(coupon => 
        coupon.id === editingId ? { 
          ...coupon, 
          ...formData,
          status: coupon.status // Durum değişmez
        } : coupon
      ));
      showToast("Kupon güncellendi!");
    } else {
      const newCoupon = {
        ...formData,
        id: Date.now(),
        usedCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: "active"
      };
      setCoupons(prev => [...prev, newCoupon]);
      showToast("Kupon eklendi!");
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== deleteId));
    showToast("Kupon silindi!");
    setShowConfirmDialog(false);
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
    showToast("Kupon durumu güncellendi!");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Aktif' },
      expired: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Süresi Dolmuş' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'Planlanmış' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // İstatistikler
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const totalLimit = coupons.reduce((sum, c) => sum + c.usageLimit, 0);

  const CouponCard = ({ coupon }) => (
    <div className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!coupon.isActive ? 'opacity-60' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900">{coupon.name}</h3>
              {getStatusBadge(coupon.status)}
            </div>
            <p className="text-gray-600 text-sm mb-3">{coupon.description}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-xl text-purple-600">
                {coupon.discountType === 'percentage' ? `%${coupon.discountValue}` : `${coupon.discountValue}₺`}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(coupon.code)}
              className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
              title="Kodu kopyala"
            >
              <Copy className="w-3 h-3" />
              <span className="font-mono text-sm font-bold">{coupon.code}</span>
            </button>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Kullanım:</span>
            <span className="font-medium">{coupon.usedCount}/{coupon.usageLimit}</span>
          </div>
          <div className="w-full bg-white/40 rounded-full h-2 mt-1">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{coupon.startDate} - {coupon.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <ShoppingCart className="w-4 h-4" />
            <span>Min. sipariş: {coupon.minOrderAmount}₺</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Oluşturulma: {coupon.createdAt}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(coupon)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Düzenle
          </button>
          <button
            onClick={() => toggleStatus(coupon.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
              coupon.isActive 
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {coupon.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {coupon.isActive ? 'Pasifleştir' : 'Aktifleştir'}
          </button>
          <button
            onClick={() => {
              setDeleteId(coupon.id);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kupon Yönetimi</h1>
              <p className="text-gray-600">Mağazanız için kuponlar oluşturun ve yönetin</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Plus className="w-5 h-5" />
              Yeni Kupon Ekle
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Kupon</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalCoupons}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Aktif Kupon</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{activeCoupons}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Kullanım</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{totalUsage}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Kullanım Oranı</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    %{totalLimit > 0 ? Math.round((totalUsage / totalLimit) * 100) : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>

        {/* Empty State */}
        {coupons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Kupon Yok</h3>
            <p className="text-gray-600 mb-6">İlk kuponunuzu oluşturarak başlayın.</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Plus className="w-5 h-5" />
              İlk Kuponu Ekle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Kupon Düzenle' : 'Yeni Kupon Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kupon Kodu *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                        placeholder="KUPON2024"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, code: generateCouponCode() }))}
                        className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                      >
                        Oluştur
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kupon Adı *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="Teknoloji Kuponu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    rows="3"
                    placeholder="Kupon açıklaması"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim Türü *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="percentage">Yüzde (%)</option>
                      <option value="fixed">Sabit Tutar (₺)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim Miktarı *
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kullanım Limiti
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Sipariş Tutarı (₺)
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kuponu Sil</h3>
              <p className="text-gray-600 mb-6">Bu kuponu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCampaignManagement;