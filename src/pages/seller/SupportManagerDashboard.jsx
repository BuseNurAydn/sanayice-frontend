import { useState, useEffect } from 'react';
import {
  FaHeadset, FaExclamationTriangle, FaQuestionCircle, FaBug, FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaHistory,
  FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaChevronRight, FaTruck, FaCreditCard, FaFilter, FaSearch, FaChartBar,
  FaReply, FaEye, FaUserTie, FaStore
} from 'react-icons/fa';
import AdminText from '../../shared/Text/AdminText';
import { getAllSupportTickets,replyToSupportTicket,updateTicketStatus} from '../../services/supportService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SupportManagerDashboard = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const { user } = useSelector((state) => state.auth);
  // tickets
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllSupportTickets();
        setTickets(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchTickets();
  }, []);
   
    const [userInfo, setUserInfo] = useState({
      name: "",
      email: "",
      phone: ""
    });
  
    useEffect(() => {
      if (user) {
        setUserInfo((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          phone: user.phone,
        }));
      }
    }, [user]);

  // Kategori tanımları
  const categories = [
    { value: 'DELIVERY', label: 'Teslimat', icon: <FaTruck />, color: 'text-red-500' },
    { value: 'PAYMENT', label: 'Ödeme', icon: <FaCreditCard />, color: 'text-blue-500' },
    { value: 'TECHNICAL', label: 'Teknik', icon: <FaBug />, color: 'text-purple-500' },
    { value: 'GENERAL', label: 'Genel', icon: <FaHeadset />, color: 'text-green-500' },
    { value: 'COMPLAINT', label: 'Şikayet', icon: <FaExclamationTriangle />, color: 'text-orange-500' },
    { value: 'ACCOUNT', label: 'Hesap', icon: <FaUser />, color: 'text-indigo-500' }
  ];

  // İstatistikler
  const stats = {
    totalTickets: tickets.length,
    pendingTickets: tickets.filter(t => t.status === 'PENDING').length,
    resolvedTickets: tickets.filter(t => t.status === 'RESOLVED').length,
    closedTickets: tickets.filter(t => t.status === 'CLOSED').length,
    highPriorityTickets: tickets.filter(t => t.priority === 'HIGH').length,
    customerTickets: tickets.filter(t => t.userType === 'customer').length,
    sellerTickets: tickets.filter(t => t.userType === 'seller').length
  };

  // Utility functions
  const getStatusConfig = (status) => {
    const configs = {
      RESOLVED: { icon: <FaCheckCircle />, text: 'Çözüldü', color: 'text-green-600 bg-green-100' },
      PENDING: { icon: <FaClock />, text: 'Bekliyor', color: 'text-yellow-600 bg-yellow-100' },
      CLOSED: { icon: <FaTimesCircle />, text: 'Kapatıldı', color: 'text-gray-600 bg-gray-100' }
    };
    return configs[status] || configs.PENDING;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      HIGH: { text: 'Yüksek', color: 'text-red-700 bg-red-100' },
      NORMAL: { text: 'Normal', color: 'text-blue-700 bg-blue-100' },
      LOW: { text: 'Düşük', color: 'text-green-700 bg-green-100' }
    };
    return configs[priority] || configs.NORMAL;
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
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && priorityMatch && categoryMatch && searchMatch;
  });

  //POST MESSAGE
  const handleReply = async () => {
  if (!replyText.trim() || !selectedTicket) return;

  setIsReplying(true);

  try {
    await replyToSupportTicket(selectedTicket.id, replyText.trim());

    // 2. Yanıt başarılı ise yeni yanıtı state'e ekle
    const newReply = {
      id: Date.now(), // Bu sadece frontend için, backend'den alınabilir
      author: 'Admin',
      message: replyText,
      date: new Date().toLocaleString('tr-TR'),
      isManager: true
    };

    // State güncellemesi
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
    toast.success("Yanıt başarıyla gönderildi.");
  } catch (error) {
    toast.error(error.message || "Yanıt gönderilirken hata oluştu.");
  } finally {
    setIsReplying(false);
  }
};
 
//PUT STATUS
  const updateStatus = async (ticketId, newStatus) => {
  try {
    await updateTicketStatus (ticketId, newStatus);

    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    }

    toast.success("Durum güncellendi");
  } catch (err) {
    toast.error(err.message || "Durum güncellenemedi");
  }
};
  return (
    <div className="min-h-screen md:p-6 px-3 py-6 bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <AdminText>Destek Talepleri Yönetimi</AdminText>
            <p className="text-gray-600">Müşteri ve satıcı destek taleplerini yönetin</p>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0">
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
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 text-white">
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
          <div className="px-2 py-4 md:p-8">
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="all">Tüm Durum</option>
                      <option value="PENDING">Bekliyor</option>
                      <option value="RESOLVED">Çözüldü</option>
                      <option value="CLOSED">Kapatıldı</option>
                    </select>

                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none"
                    >
                      <option value="all">Tüm Öncelik</option>
                      <option value="HIGH">Yüksek</option>
                      <option value="NORMAL">Normal</option>
                      <option value="LOW">Düşük</option>
                    </select>

                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none"
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
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTicket?.id === ticket.id
                          ? 'border-orange-500 bg-orange-50'
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
                            {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
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
                            <span>{new Date(selectedTicket.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={selectedTicket.status}
                            onChange={(e) => updateStatus(selectedTicket.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1 outline-none"
                          >
                            <option value="PENDING">Bekliyor</option>
                            <option value="RESOLVED">Çözüldü</option>
                            <option value="CLOSED">Kapatıldı</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Info  //Backendden gelmiyor , düzenlenmesi lazım */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              {selectedTicket.userType === 'seller' ? 'Satıcı' : 'Müşteri'}
                            </div>
                            <div className="font-medium text-gray-800">
                              {selectedTicket.customer?.name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">E-posta</div>
                            <div className="font-medium text-gray-800">
                              {selectedTicket.customer?.email}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Telefon</div>
                            <div className="font-medium text-gray-800">
                                {selectedTicket.customer?.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Original Message */}
                    <div className="bg-orange-100 border border-orange-500 rounded-lg p-4">
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
                            {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none outline-none"
                          placeholder="Yanıtınızı yazın..."
                        />
                        <button
                          onClick={handleReply}
                          disabled={!replyText.trim() || isReplying}
                          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${!replyText.trim() || isReplying
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