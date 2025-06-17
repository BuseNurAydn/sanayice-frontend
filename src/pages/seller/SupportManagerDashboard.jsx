import React, { useState, useEffect } from 'react';
import { 
  FaHeadset, 
  FaExclamationTriangle, 
  FaQuestionCircle, 
  FaBug, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaPaperPlane, 
  FaHistory, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaStar,
  FaChevronRight,
  FaTruck,
  FaCreditCard,
  FaFilter,
  FaSearch,
  FaChartBar,
  FaReply,
  FaEye,
  FaUserTie,
  FaStore,
  
} from 'react-icons/fa';

const SupportManagerDashboard = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Örnek ticket verileri
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: 'Sipariş Teslim Edilmedi',
      category: 'delivery',
      status: 'pending',
      priority: 'high',
      date: '2024-06-17',
      customerName: 'Ayşe Yılmaz',
      customerEmail: 'ayse.yilmaz@email.com',
      customerPhone: '0532 123 45 67',
      description: 'Siparişim 3 gündür gelmedi. Takip numarası ile kontrol ediyorum ama kargo şirketinde kayıt yok. Acilen çözüm istiyorum.',
      userType: 'customer',
      assignedTo: 'Mehmet Özkan',
      replies: [
        {
          id: 1,
          author: 'Mehmet Özkan',
          message: 'Merhaba Ayşe Hanım, siparişinizle ilgili sorunu inceliyoruz. Kargo şirketi ile iletişime geçtik.',
          date: '2024-06-17 14:30',
          isManager: true
        }
      ]
    },
    {
      id: 2,
      subject: 'Ödeme İadesi Sorunu',
      category: 'payment',
      status: 'resolved',
      priority: 'normal',
      date: '2024-06-16',
      customerName: 'Ali Demir',
      customerEmail: 'ali.demir@email.com',
      customerPhone: '0541 987 65 43',
      description: 'İade ettiğim ürün için ödeme iadesi alamadım. 15 gün oldu.',
      userType: 'customer',
      assignedTo: 'Zeynep Kaya',
      replies: [
        {
          id: 1,
          author: 'Zeynep Kaya',
          message: 'Merhaba Ali Bey, iade işleminiz onaylanmıştır. 3-5 iş günü içinde hesabınıza yansıyacaktır.',
          date: '2024-06-16 10:15',
          isManager: true
        }
      ]
    },
    {
      id: 3,
      subject: 'Satıcı Paneli Sorunu',
      category: 'technical',
      status: 'pending',
      priority: 'high',
      date: '2024-06-17',
      customerName: 'Elektro Mağaza',
      customerEmail: 'info@elektromarket.com',
      customerPhone: '0212 555 12 34',
      description: 'Satıcı panelinde ürün yükleyemiyorum. Sürekli hata veriyor.',
      userType: 'seller',
      assignedTo: 'Fatma Şen',
      replies: []
    },
    {
      id: 4,
      subject: 'Genel Bilgi Talebi',
      category: 'general',
      status: 'closed',
      priority: 'low',
      date: '2024-06-15',
      customerName: 'Mehmet Kara',
      customerEmail: 'mehmet.kara@email.com',
      customerPhone: '0505 444 33 22',
      description: 'Komisyon oranları hakkında bilgi almak istiyorum.',
      userType: 'seller',
      assignedTo: 'Ahmet Yıldız',
      replies: [
        {
          id: 1,
          author: 'Ahmet Yıldız',
          message: 'Merhaba, komisyon oranları kategori bazında değişmektedir. Detaylı bilgi için satıcı panelindeki komisyon tablosunu inceleyebilirsiniz.',
          date: '2024-06-15 16:45',
          isManager: true
        }
      ]
    },
    {
      id: 5,
      subject: 'Hesap Doğrulama Problemi',
      category: 'account',
      status: 'pending',
      priority: 'normal',
      date: '2024-06-17',
      customerName: 'Fatma Özdemir',
      customerEmail: 'fatma.ozdemir@email.com',
      customerPhone: '0533 555 77 88',
      description: 'Hesabımı doğrulama kodu gelmiyor. E-posta adresimi değiştirmek istiyorum.',
      userType: 'customer',
      assignedTo: 'Ayşe Kaya',
      replies: []
    },
    {
      id: 6,
      subject: 'Ürün Kalite Şikayeti',
      category: 'complaint',
      status: 'pending',
      priority: 'high',
      date: '2024-06-16',
      customerName: 'Hasan Yıldız',
      customerEmail: 'hasan.yildiz@email.com',
      customerPhone: '0544 333 22 11',
      description: 'Aldığım ürün açıklamada belirtilenden farklı. İade etmek istiyorum ama satıcı kabul etmiyor.',
      userType: 'customer',
      assignedTo: 'Mehmet Özkan',
      replies: [
        {
          id: 1,
          author: 'Mehmet Özkan',
          message: 'Merhaba Hasan Bey, durumu satıcı ile görüştük. İade sürecini başlattık.',
          date: '2024-06-16 15:20',
          isManager: true
        }
      ]
    }
  ]);

  // Kategori tanımları
  const categories = [
    { value: 'delivery', label: 'Teslimat', icon: <FaTruck />, color: 'text-red-500' },
    { value: 'payment', label: 'Ödeme', icon: <FaCreditCard />, color: 'text-blue-500' },
    { value: 'technical', label: 'Teknik', icon: <FaBug />, color: 'text-purple-500' },
    { value: 'general', label: 'Genel', icon: <FaHeadset />, color: 'text-green-500' },
    { value: 'complaint', label: 'Şikayet', icon: <FaExclamationTriangle />, color: 'text-orange-500' },
    { value: 'account', label: 'Hesap', icon: <FaUser />, color: 'text-indigo-500' }
  ];

  // İstatistikler
  const stats = {
    totalTickets: tickets.length,
    pendingTickets: tickets.filter(t => t.status === 'pending').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    closedTickets: tickets.filter(t => t.status === 'closed').length,
    highPriorityTickets: tickets.filter(t => t.priority === 'high').length,
    customerTickets: tickets.filter(t => t.userType === 'customer').length,
    sellerTickets: tickets.filter(t => t.userType === 'seller').length
  };

  // Utility functions
  const getStatusConfig = (status) => {
    const configs = {
      resolved: { icon: <FaCheckCircle />, text: 'Çözüldü', color: 'text-green-600 bg-green-100' },
      pending: { icon: <FaClock />, text: 'Bekliyor', color: 'text-yellow-600 bg-yellow-100' },
      closed: { icon: <FaTimesCircle />, text: 'Kapatıldı', color: 'text-gray-600 bg-gray-100' }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { text: 'Yüksek', color: 'text-red-700 bg-red-100' },
      normal: { text: 'Normal', color: 'text-blue-700 bg-blue-100' },
      low: { text: 'Düşük', color: 'text-green-700 bg-green-100' }
    };
    return configs[priority] || configs.normal;
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || { label: 'Genel', icon: <FaHeadset />, color: 'text-gray-500' };
  };

  // Filtreleme
  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    const categoryMatch = filterCategory === 'all' || ticket.category === filterCategory;
    const searchMatch = searchTerm === '' || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && priorityMatch && categoryMatch && searchMatch;
  });

  // Reply handler
  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    setIsReplying(true);
    
    setTimeout(() => {
      const newReply = {
        id: Date.now(),
        author: 'Admin',
        message: replyText,
        date: new Date().toLocaleString('tr-TR'),
        isManager: true
      };
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, replies: [...ticket.replies, newReply] }
          : ticket
      ));
      
      setSelectedTicket(prev => ({
        ...prev,
        replies: [...prev.replies, newReply]
      }));
      
      setReplyText('');
      setIsReplying(false);
    }, 1000);
  };

  // Status güncelleme
  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Destek Talepleri Yönetimi</h1>
            <p className="text-gray-600">Müşteri ve satıcı destek taleplerini yönetin</p>
          </div>
          
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTickets}</div>
              <div className="text-sm text-gray-500">Toplam</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingTickets}</div>
              <div className="text-sm text-gray-500">Bekliyor</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
              <div className="text-sm text-gray-500">Çözüldü</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highPriorityTickets}</div>
              <div className="text-sm text-gray-500">Acil</div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.customerTickets}</div>
                <div className="text-blue-100">Müşteri Talepleri</div>
              </div>
              <FaUser className="text-blue-200 text-3xl" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.sellerTickets}</div>
                <div className="text-orange-100">Satıcı Talepleri</div>
              </div>
              <FaStore className="text-orange-200 text-3xl" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.closedTickets}</div>
                <div className="text-purple-100">Kapatılan Talepler</div>
              </div>
              <FaTimesCircle className="text-purple-200 text-3xl" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Ticket List */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ticket ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">Tüm Durum</option>
                      <option value="pending">Bekliyor</option>
                      <option value="resolved">Çözüldü</option>
                      <option value="closed">Kapatıldı</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">Tüm Öncelik</option>
                      <option value="high">Yüksek</option>
                      <option value="normal">Normal</option>
                      <option value="low">Düşük</option>
                    </select>
                    
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">Tüm Kategori</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ticket Cards */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTickets.map((ticket) => {
                    const statusConfig = getStatusConfig(ticket.status);
                    const priorityConfig = getPriorityConfig(ticket.priority);
                    const categoryInfo = getCategoryInfo(ticket.category);

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedTicket?.id === ticket.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={categoryInfo.color}>
                              {categoryInfo.icon}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${ticket.userType === 'seller' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {ticket.userType === 'seller' ? <FaStore className="inline mr-1" /> : <FaUser className="inline mr-1" />}
                              {ticket.userType === 'seller' ? 'Satıcı' : 'Müşteri'}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig.color}`}>
                            {priorityConfig.text}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                          {ticket.subject}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                          {ticket.customerName}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.date).toLocaleDateString('tr-TR')}
                          </span>
                          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span>{statusConfig.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ticket Detail */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <div className="space-y-6">
                    
                    {/* Ticket Header */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {selectedTicket.subject}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>#{selectedTicket.id.toString().padStart(6, '0')}</span>
                            <span>{getCategoryInfo(selectedTicket.category).label}</span>
                            <span>{new Date(selectedTicket.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedTicket.status}
                            onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                          >
                            <option value="pending">Bekliyor</option>
                            <option value="resolved">Çözüldü</option>
                            <option value="closed">Kapatıldı</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              {selectedTicket.userType === 'seller' ? 'Satıcı' : 'Müşteri'}
                            </div>
                            <div className="font-medium text-gray-800">
                              {selectedTicket.customerName}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">E-posta</div>
                            <div className="font-medium text-gray-800">
                              {selectedTicket.customerEmail}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Telefon</div>
                            <div className="font-medium text-gray-800">
                              {selectedTicket.customerPhone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Original Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTicket.userType === 'seller' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                          {selectedTicket.userType === 'seller' ? 
                            <FaStore className="text-white text-sm" /> : 
                            <FaUser className="text-white text-sm" />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {selectedTicket.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(selectedTicket.date).toLocaleString('tr-TR')}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedTicket.description}
                      </p>
                    </div>

                    {/* Replies */}
                    {selectedTicket.replies.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Yanıtlar</h4>
                        {selectedTicket.replies.map((reply) => (
                          <div key={reply.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <FaUserTie className="text-white text-sm" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {reply.author} (Destek Ekibi)
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reply.date}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {reply.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Yanıt Yaz</h4>
                      <div className="space-y-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Yanıtınızı yazın..."
                        />
                        <button
                          onClick={handleReply}
                          disabled={!replyText.trim() || isReplying}
                          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                            !replyText.trim() || isReplying
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {isReplying ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Gönderiliyor...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaReply />
                              <span>Yanıtla</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaHeadset className="text-gray-300 text-5xl mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-500 mb-2">
                      Ticket Seçin
                    </h4>
                    <p className="text-gray-400">
                      Detayları görüntülemek için sol taraftan bir ticket seçin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportManagerDashboard;