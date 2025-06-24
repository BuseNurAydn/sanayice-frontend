import { useState, useEffect } from "react";
import { Eye, EyeOff, BarChart3, Calendar, Percent, Users, Gift, Star, ShoppingCart, Store, Filter, Search, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SellerCampaignOverview = () => {
  const [sellerCampaigns, setSellerCampaigns] = useState([]);
  const [sellerCoupons, setSellerCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Satıcı kampanyaları
  useEffect(() => {
    setSellerCampaigns([
      {
        id: 1,
        sellerId: 1,
        sellerName: "TechWorld Mağazası",
        sellerLogo: "🖥️",
        name: "Laptop Festivali",
        description: "Tüm laptop modellerinde büyük indirimler",
        discountType: "percentage",
        discountValue: 20,
        startDate: "2024-06-01",
        endDate: "2024-06-30",
        minOrderAmount: 500,
        isActive: true,
        status: "active",
        usageCount: 45,
        createdAt: "2024-05-20",
        category: "Elektronik"
      },
      {
        id: 2,
        sellerId: 2,
        sellerName: "Moda Dünyası",
        sellerLogo: "👗",
        name: "Yaz Koleksiyonu",
        description: "Yeni sezon kadın giyim ürünlerinde özel fırsatlar",
        discountType: "percentage",
        discountValue: 35,
        startDate: "2024-05-15",
        endDate: "2024-07-15",
        minOrderAmount: 200,
        isActive: true,
        status: "active",
        usageCount: 128,
        createdAt: "2024-05-10",
        category: "Moda"
      },
      {
        id: 3,
        sellerId: 3,
        sellerName: "Ev & Bahçe Market",
        sellerLogo: "🏠",
        name: "Bahçe Düzenleme",
        description: "Bahçe ürünlerinde süper indirimler",
        discountType: "fixed",
        discountValue: 75,
        startDate: "2024-04-01",
        endDate: "2024-05-31",
        minOrderAmount: 300,
        isActive: false,
        status: "expired",
        usageCount: 67,
        createdAt: "2024-03-25",
        category: "Ev & Bahçe"
      },
      {
        id: 4,
        sellerId: 1,
        sellerName: "TechWorld Mağazası",
        sellerLogo: "🖥️",
        name: "Akıllı Telefon Haftası",
        description: "Akıllı telefon ve aksesuarlarında özel indirimler",
        discountType: "percentage",
        discountValue: 15,
        startDate: "2024-07-01",
        endDate: "2024-07-07",
        minOrderAmount: 400,
        isActive: false,
        status: "scheduled",
        usageCount: 0,
        createdAt: "2024-06-15",
        category: "Elektronik"
      },
      {
        id: 5,
        sellerId: 4,
        sellerName: "Spor Dünyası",
        sellerLogo: "⚽",
        name: "Fitness Ekipmanları",
        description: "Fitness ve spor ekipmanlarında büyük indirimler",
        discountType: "percentage",
        discountValue: 25,
        startDate: "2024-06-10",
        endDate: "2024-08-10",
        minOrderAmount: 250,
        isActive: true,
        status: "active",
        usageCount: 89,
        createdAt: "2024-06-01",
        category: "Spor"
      }
    ]);

    setSellerCoupons([
      {
        id: 1,
        sellerId: 1,
        sellerName: "TechWorld Mağazası",
        sellerLogo: "🖥️",
        code: "TECH2024",
        name: "Tech Lover Kuponu",
        description: "Teknoloji severlere özel kupon",
        discountType: "percentage",
        discountValue: 10,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        usageLimit: 500,
        usedCount: 156,
        minOrderAmount: 300,
        isActive: true,
        status: "active",
        createdAt: "2024-01-01",
        category: "Elektronik"
      },
      {
        id: 2,
        sellerId: 2,
        sellerName: "Moda Dünyası",
        sellerLogo: "👗",
        code: "MODA50",
        name: "Moda Kuponu",
        description: "Moda ürünlerinde geçerli özel kupon",
        discountType: "fixed",
        discountValue: 50,
        startDate: "2024-05-01",
        endDate: "2024-08-31",
        usageLimit: 300,
        usedCount: 89,
        minOrderAmount: 200,
        isActive: true,
        status: "active",
        createdAt: "2024-04-25",
        category: "Moda"
      },
      {
        id: 3,
        sellerId: 3,
        sellerName: "Ev & Bahçe Market",
        sellerLogo: "🏠",
        code: "EVIM2024",
        name: "Ev Dekorasyonu",
        description: "Ev dekorasyon ürünlerinde özel indirim",
        discountType: "percentage",
        discountValue: 20,
        startDate: "2024-03-01",
        endDate: "2024-06-30",
        usageLimit: 200,
        usedCount: 134,
        minOrderAmount: 150,
        isActive: true,
        status: "active",
        createdAt: "2024-02-20",
        category: "Ev & Bahçe"
      },
      {
        id: 4,
        sellerId: 4,
        sellerName: "Spor Dünyası",
        sellerLogo: "⚽",
        code: "SPORCU",
        name: "Sporcu Kuponu",
        description: "Sporcular için özel indirim kuponu",
        discountType: "percentage",
        discountValue: 15,
        startDate: "2024-04-01",
        endDate: "2024-04-30",
        usageLimit: 150,
        usedCount: 145,
        minOrderAmount: 200,
        isActive: false,
        status: "expired",
        createdAt: "2024-03-20",
        category: "Spor"
      },
      {
        id: 5,
        sellerId: 2,
        sellerName: "Moda Dünyası",
        sellerLogo: "👗",
        code: "YENI2024",
        name: "Yeni Müşteri",
        description: "Yeni müşteriler için hoş geldin kuponu",
        discountType: "fixed",
        discountValue: 30,
        startDate: "2024-07-01",
        endDate: "2024-12-31",
        usageLimit: 1000,
        usedCount: 0,
        minOrderAmount: 100,
        isActive: false,
        status: "scheduled",
        createdAt: "2024-06-20",
        category: "Moda"
      }
    ]);
  }, []);

  // Filtreler
  const sellers = [...new Set([...sellerCampaigns, ...sellerCoupons].map(item => ({ id: item.sellerId, name: item.sellerName })))];
  
  const filteredCampaigns = sellerCampaigns.filter(campaign => {
    return (selectedSeller === 'all' || campaign.sellerId === parseInt(selectedSeller)) &&
           (statusFilter === 'all' || campaign.status === statusFilter) &&
           (searchTerm === '' || campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            campaign.sellerName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredCoupons = sellerCoupons.filter(coupon => {
    return (selectedSeller === 'all' || coupon.sellerId === parseInt(selectedSeller)) &&
           (statusFilter === 'all' || coupon.status === statusFilter) &&
           (searchTerm === '' || coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            coupon.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // İstatistikler
  const totalCampaigns = sellerCampaigns.length;
  const activeCampaigns = sellerCampaigns.filter(c => c.status === 'active').length;
  const totalCoupons = sellerCoupons.length;
  const activeCoupons = sellerCoupons.filter(c => c.status === 'active').length;
  const totalUsage = [...sellerCampaigns, ...sellerCoupons].reduce((sum, item) => sum + (item.usageCount || item.usedCount || 0), 0);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Aktif' },
      expired: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Süresi Dolmuş' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'Planlanmış' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle, label: 'Pasif' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const CampaignCard = ({ campaign }) => (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              {campaign.sellerLogo}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
              <p className="text-sm text-gray-600">{campaign.sellerName}</p>
            </div>
          </div>
          {getStatusBadge(campaign.status)}
        </div>

        <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>

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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Kategori</span>
            </div>
            <p className="font-bold text-blue-700">{campaign.category}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{campaign.startDate} - {campaign.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <ShoppingCart className="w-4 h-4" />
            <span>Min. sipariş: {campaign.minOrderAmount}₺</span>
          </div>
        </div>
      </div>
    </div>
  );

  const CouponCard = ({ coupon }) => (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl">
              {coupon.sellerLogo}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{coupon.name}</h3>
              <p className="text-sm text-gray-600">{coupon.sellerName}</p>
            </div>
          </div>
          {getStatusBadge(coupon.status)}
        </div>

        <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-xl text-purple-600">
                {coupon.discountType === 'percentage' ? `%${coupon.discountValue}` : `${coupon.discountValue}₺`}
              </span>
            </div>
            <div className="bg-white/60 px-3 py-1 rounded-lg">
              <span className="font-mono text-sm font-bold text-purple-700">{coupon.code}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Kullanım:</span>
            <span className="font-medium">{coupon.usedCount}/{coupon.usageLimit}</span>
          </div>
          <div className="w-full bg-white/40 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-indigo-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-indigo-600 font-medium">Kullanım Oranı</span>
            </div>
            <p className="font-bold text-indigo-700">%{Math.round((coupon.usedCount / coupon.usageLimit) * 100)}</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-teal-600" />
              <span className="text-xs text-teal-600 font-medium">Kategori</span>
            </div>
            <p className="font-bold text-teal-700">{coupon.category}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{coupon.startDate} - {coupon.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <ShoppingCart className="w-4 h-4" />
            <span>Min. sipariş: {coupon.minOrderAmount}₺</span>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Satıcı Kampanya & Kupon Takibi</h1>
            <p className="text-gray-600">Satıcıların oluşturduğu kampanya ve kuponları takip edin</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Store className="w-5 h-5" />
            <span className="text-sm font-medium">{sellers.length} Satıcı</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Toplam Kampanya</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalCampaigns}</p>
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
                <p className="text-2xl font-bold text-green-600 mt-1">{activeCampaigns}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Toplam Kupon</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalCoupons}</p>
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
                <p className="text-2xl font-bold text-indigo-600 mt-1">{activeCoupons}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-indigo-600" />
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
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Kampanya, kupon veya satıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">Tüm Satıcılar</option>
                {sellers.map(seller => (
                  <option key={seller.id} value={seller.id}>{seller.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="expired">Süresi Dolmuş</option>
                <option value="scheduled">Planlanmış</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8">
          <div className="flex gap-1">
            {[
              { key: 'campaigns', label: 'Kampanyalar', count: filteredCampaigns.length, icon: BarChart3 },
              { key: 'coupons', label: 'Kuponlar', count: filteredCoupons.length, icon: Gift }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
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
          {activeTab === 'campaigns' && filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
          
          {activeTab === 'coupons' && filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'campaigns' && filteredCampaigns.length === 0) || 
          (activeTab === 'coupons' && filteredCoupons.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'campaigns' ? 
                <BarChart3 className="w-12 h-12 text-gray-400" /> :
                <Gift className="w-12 h-12 text-gray-400" />
              }
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'campaigns' ? 'Kampanya Bulunamadı' : 'Kupon Bulunamadı'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedSeller !== 'all' || statusFilter !== 'all' 
                ? 'Arama kriterlerinize uygun sonuç bulunamadı.' 
                : activeTab === 'campaigns' 
                  ? 'Henüz hiç satıcı kampanyası bulunmuyor.' 
                  : 'Henüz hiç satıcı kuponu bulunmuyor.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCampaignOverview;