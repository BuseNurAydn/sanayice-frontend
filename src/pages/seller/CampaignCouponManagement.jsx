import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, BarChart3, Calendar, Percent, Users, Gift, Copy, Clock, Star, ShoppingCart, CreditCard } from "lucide-react";

const CampaignCouponManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('campaign'); // 'campaign' or 'coupon'
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');

  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    description: "",
    discountType: "percentage", // percentage, fixed
    discountValue: "",
    startDate: "",
    endDate: "",
    minOrderAmount: "",
    isActive: true,
    order: 1
  });

  const [couponFormData, setCouponFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    usedCount: 0,
    minOrderAmount: "",
    targetType: "all", // all, specific
    isActive: true
  });

  // Mock data
  useEffect(() => {
    setCampaigns([
      {
        id: 1,
        name: "Yaz İndirimleri 2024",
        description: "Tüm yaz ürünlerinde geçerli büyük indirim kampanyası",
        discountType: "percentage",
        discountValue: 25,
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        minOrderAmount: 200,
        isActive: true,
        order: 1,
        createdAt: "2024-05-15",
        usageCount: 156
      },
      {
        id: 2,
        name: "Sonbahar Koleksiyonu",
        description: "Yeni sezon ürünlerinde özel fırsatlar",
        discountType: "fixed",
        discountValue: 50,
        startDate: "2024-09-01",
        endDate: "2024-11-30",
        minOrderAmount: 300,
        isActive: true,
        order: 2,
        createdAt: "2024-05-20",
        usageCount: 89
      },
      {
        id: 3,
        name: "Kış Kampanyası",
        description: "Kış ürünlerinde büyük fırsatlar",
        discountType: "percentage",
        discountValue: 30,
        startDate: "2024-12-01",
        endDate: "2025-02-28",
        minOrderAmount: 150,
        isActive: false,
        order: 3,
        createdAt: "2024-04-10",
        usageCount: 45
      }
    ]);

    setCoupons([
      {
        id: 1,
        code: "WELCOME2024",
        name: "Hoş Geldin Kuponu",
        description: "Yeni üyeler için özel indirim kuponu",
        discountType: "percentage",
        discountValue: 15,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        usageLimit: 1000,
        usedCount: 234,
        minOrderAmount: 100,
        targetType: "all",
        isActive: true,
        createdAt: "2024-01-01"
      },
      {
        id: 2,
        code: "SUMMER50",
        name: "Yaz Kuponu",
        description: "Yaz aylarında geçerli özel kupon",
        discountType: "fixed",
        discountValue: 50,
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        usageLimit: 500,
        usedCount: 167,
        minOrderAmount: 250,
        targetType: "specific",
        isActive: true,
        createdAt: "2024-05-25"
      },
      {
        id: 3,
        code: "STUDENT20",
        name: "Öğrenci İndirimi",
        description: "Öğrenciler için özel indirim",
        discountType: "percentage",
        discountValue: 20,
        startDate: "2024-09-01",
        endDate: "2025-06-30",
        usageLimit: 300,
        usedCount: 78,
        minOrderAmount: 150,
        targetType: "specific",
        isActive: false,
        createdAt: "2024-08-15"
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

  const handleAdd = (type) => {
    if (type === 'campaign') {
      setCampaignFormData({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        minOrderAmount: "",
        isActive: true,
        order: campaigns.length + 1
      });
    } else {
      setCouponFormData({
        code: generateCouponCode(),
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        usedCount: 0,
        minOrderAmount: "",
        targetType: "all",
        isActive: true
      });
    }
    setModalType(type);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item, type) => {
    if (type === 'campaign') {
      setCampaignFormData({
        name: item.name,
        description: item.description,
        discountType: item.discountType,
        discountValue: item.discountValue,
        startDate: item.startDate,
        endDate: item.endDate,
        minOrderAmount: item.minOrderAmount,
        isActive: item.isActive,
        order: item.order
      });
    } else {
      setCouponFormData({
        code: item.code,
        name: item.name,
        description: item.description,
        discountType: item.discountType,
        discountValue: item.discountValue,
        startDate: item.startDate,
        endDate: item.endDate,
        usageLimit: item.usageLimit,
        usedCount: item.usedCount,
        minOrderAmount: item.minOrderAmount,
        targetType: item.targetType,
        isActive: item.isActive
      });
    }
    setModalType(type);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'campaign') {
      if (!campaignFormData.name.trim() || !campaignFormData.discountValue) {
        showToast("Kampanya adı ve indirim miktarı zorunludur!", 'error');
        return;
      }
      
      if (editingId) {
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === editingId ? { ...campaign, ...campaignFormData } : campaign
        ));
        showToast("Kampanya güncellendi!");
      } else {
        const newCampaign = {
          ...campaignFormData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
          usageCount: 0
        };
        setCampaigns(prev => [...prev, newCampaign]);
        showToast("Kampanya eklendi!");
      }
    } else {
      if (!couponFormData.code.trim() || !couponFormData.name.trim() || !couponFormData.discountValue) {
        showToast("Kupon kodu, isim ve indirim miktarı zorunludur!", 'error');
        return;
      }
      
      if (editingId) {
        setCoupons(prev => prev.map(coupon => 
          coupon.id === editingId ? { ...coupon, ...couponFormData } : coupon
        ));
        showToast("Kupon güncellendi!");
      } else {
        const newCoupon = {
          ...couponFormData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        setCoupons(prev => [...prev, newCoupon]);
        showToast("Kupon eklendi!");
      }
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (deleteType === 'campaign') {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== deleteId));
      showToast("Kampanya silindi!");
    } else {
      setCoupons(prev => prev.filter(coupon => coupon.id !== deleteId));
      showToast("Kupon silindi!");
    }
    setShowConfirmDialog(false);
    setDeleteId(null);
    setDeleteType(null);
  };

  const toggleStatus = (id, type) => {
    if (type === 'campaign') {
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id ? { ...campaign, isActive: !campaign.isActive } : campaign
      ));
      showToast("Kampanya durumu güncellendi!");
    } else {
      setCoupons(prev => prev.map(coupon => 
        coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
      ));
      showToast("Kupon durumu güncellendi!");
    }
  };

  const activeCampaigns = campaigns.filter(c => c.isActive);
  const activeCoupons = coupons.filter(c => c.isActive);
  const totalUsage = campaigns.reduce((sum, c) => sum + c.usageCount, 0);

  const CampaignCard = ({ campaign }) => (
    <div className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!campaign.isActive ? 'opacity-60' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${campaign.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {campaign.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{campaign.description}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-2xl text-orange-600">
                {campaign.discountType === 'percentage' ? `%${campaign.discountValue}` : `${campaign.discountValue}₺`}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Kullanım</p>
              <p className="font-bold text-gray-900">{campaign.usageCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{campaign.startDate} - {campaign.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <ShoppingCart className="w-4 h-4" />
            <span>Min. sipariş: {campaign.minOrderAmount}₺</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Oluşturulma: {campaign.createdAt}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(campaign, 'campaign')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Düzenle
          </button>
          <button
            onClick={() => toggleStatus(campaign.id, 'campaign')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
              campaign.isActive 
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {campaign.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {campaign.isActive ? 'Pasifleştir' : 'Aktifleştir'}
          </button>
          <button
            onClick={() => {
              setDeleteId(campaign.id);
              setDeleteType('campaign');
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

  const CouponCard = ({ coupon }) => (
    <div className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!coupon.isActive ? 'opacity-60' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900">{coupon.name}</h3>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${coupon.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {coupon.isActive ? 'Aktif' : 'Pasif'}
              </span>
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
              style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
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
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users className="w-4 h-4" />
            <span>Hedef: {coupon.targetType === 'all' ? 'Tüm Kullanıcılar' : 'Belirli Kullanıcılar'}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(coupon, 'coupon')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Düzenle
          </button>
          <button
            onClick={() => toggleStatus(coupon.id, 'coupon')}
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
              setDeleteType('coupon');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kampanya ve Kupon Yönetimi</h1>
            <p className="text-gray-600">İndirim kampanyalarınızı ve kuponlarınızı yönetin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleAdd('campaign')}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Yeni Kampanya
            </button>
            <button
              onClick={() => handleAdd('coupon')}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg"
            >
              <Gift className="w-5 h-5" />
              Yeni Kupon
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Toplam Kampanya</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{campaigns.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Aktif Kampanya</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeCampaigns.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Toplam Kupon</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{coupons.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Toplam Kullanım</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalUsage}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8">
          <div className="flex gap-1">
            {[
              { key: 'campaigns', label: 'Kampanyalar', count: campaigns.length, icon: BarChart3 },
              { key: 'coupons', label: 'Kuponlar', count: coupons.length, icon: Gift }
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
                <tab.icon className="w-4 h-4" />
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === 'campaigns' && campaigns
            .sort((a, b) => a.order - b.order)
            .map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          
          {activeTab === 'coupons' && coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>

        {((activeTab === 'campaigns' && campaigns.length === 0) || 
          (activeTab === 'coupons' && coupons.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'campaigns' ? 
                <BarChart3 className="w-12 h-12 text-gray-400" /> :
                <Gift className="w-12 h-12 text-gray-400" />
              }
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'campaigns' ? 'Kampanya Bulunmuyor' : 'Kupon Bulunmuyor'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'campaigns' ? 
                'Henüz hiç kampanya eklenmemiş.' : 
                'Henüz hiç kupon eklenmemiş.'
              }
            </p>
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
                  {editingId ? 
                    (modalType === 'campaign' ? "Kampanya Güncelle" : "Kupon Güncelle") :
                    (modalType === 'campaign' ? "Yeni Kampanya Ekle" : "Yeni Kupon Ekle")
                  }
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
                {modalType === 'campaign' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kampanya Adı *
                      </label>
                      <input
                        type="text"
                        value={campaignFormData.name}
                        onChange={(e) => setCampaignFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        placeholder="Kampanya adını girin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={campaignFormData.description}
                        onChange={(e) => setCampaignFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        rows="3"
                        placeholder="Kampanya açıklaması"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İndirim Türü *
                        </label>
                        <select
                          value={campaignFormData.discountType}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, discountType: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
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
                          value={campaignFormData.discountValue}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                          placeholder={campaignFormData.discountType === 'percentage' ? '25' : '50'}
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
                          value={campaignFormData.startDate}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitiş Tarihi *
                        </label>
                        <input
                          type="date"
                          value={campaignFormData.endDate}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min. Sipariş Tutarı (₺)
                        </label>
                        <input
                          type="number"
                          value={campaignFormData.minOrderAmount}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sıra
                        </label>
                        <input
                          type="number"
                          value={campaignFormData.order}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, order: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={campaignFormData.isActive}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Aktif</span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kupon Kodu *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponFormData.code}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                            placeholder="KUPON2024"
                          />
                          <button
                            type="button"
                            onClick={() => setCouponFormData(prev => ({ ...prev, code: generateCouponCode() }))}
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
                          value={couponFormData.name}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder="Kupon adını girin"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={couponFormData.description}
                        onChange={(e) => setCouponFormData(prev => ({ ...prev, description: e.target.value }))}
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
                          value={couponFormData.discountType}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, discountType: e.target.value }))}
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
                          value={couponFormData.discountValue}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder={couponFormData.discountType === 'percentage' ? '15' : '25'}
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
                          value={couponFormData.startDate}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitiş Tarihi *
                        </label>
                        <input
                          type="date"
                          value={couponFormData.endDate}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kullanım Limiti
                        </label>
                        <input
                          type="number"
                          value={couponFormData.usageLimit}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min. Sipariş Tutarı (₺)
                        </label>
                        <input
                          type="number"
                          value={couponFormData.minOrderAmount}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hedef Kitle
                        </label>
                        <select
                          value={couponFormData.targetType}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, targetType: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="all">Tüm Kullanıcılar</option>
                          <option value="specific">Belirli Kullanıcılar</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={couponFormData.isActive}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Aktif</span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className={`flex-1 px-6 py-3 text-white rounded-xl hover:opacity-90 transition-colors font-medium ${
                    modalType === 'campaign' ? 'bg-orange-600' : 'bg-purple-600'
                  }`}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {deleteType === 'campaign' ? 'Kampanya Sil' : 'Kupon Sil'}
              </h3>
              <p className="text-gray-600 mb-6">
                Bu {deleteType === 'campaign' ? 'kampanyayı' : 'kuponu'} silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
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

export default CampaignCouponManagement;