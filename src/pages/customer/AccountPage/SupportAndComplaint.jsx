import { useState, useEffect } from 'react';
import { FaHeadset, FaExclamationTriangle, FaQuestionCircle, FaBug, FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaHistory, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaChevronRight, FaTruck, FaCreditCard } from 'react-icons/fa';
import { createSupportTicket, getSupportTicketsByCustomer } from '../../../services/supportService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SupportAndComplaint = () => {
  const [supportHistory, setSupportHistory] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const customerId = user?.id;
  const [activeTab, setActiveTab] = useState('new');
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'BILLING',
    priority: 'MEDIUM',
    customerId: customerId,
    userType: role === 'ROLE_SELLER' ? 'seller' : 'customer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kategori tanımları - daha temiz tasarım için revize edildi
  const categories = [
    {
      value: 'delivery',
      label: 'Teslimat Sorunu',
      icon: <FaTruck className="text-2xl" />,
      description: 'Kargo ve teslimat sorunları',
      color: 'border-red-200 hover:border-red-300 hover:bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      value: 'payment',
      label: 'Ödeme Sorunu',
      icon: <FaCreditCard className="text-2xl" />,
      description: 'Ödeme ve fatura sorunları',
      color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      value: 'technical',
      label: 'Teknik Sorun',
      icon: <FaBug className="text-2xl" />,
      description: 'Uygulama ve website hataları',
      color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      value: 'general',
      label: 'Genel Destek',
      icon: <FaHeadset className="text-2xl" />,
      description: 'Diğer sorular ve yardım',
      color: 'border-green-200 hover:border-green-300 hover:bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      value: 'complaint',
      label: 'Şikayet',
      icon: <FaStar className="text-2xl" />,
      description: 'Hizmet kalitesi ve memnuniyetsizlik',
      color: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50',
      iconColor: 'text-orange-500'
    }
  ];

  //GET
  useEffect(() => {
    if (activeTab === 'history' && user?.id) {
      const fetchTickets = async () => {
        try {
          const data = await getSupportTicketsByCustomer(user.id);
          setSupportHistory(data);
          console.log(data)
        } catch (error) {
          toast.error(error.message || "Talepler yüklenirken hata oluştu");
        }
      };
      fetchTickets();
    }
  }, [activeTab, user?.id]);

  //POST
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      category: formData.category.toUpperCase(),
      priority: formData.priority.toUpperCase(),
      customerId: Number(customerId),
      userType: role === 'ROLE_SELLER' ? 'seller' : 'customer'
    };

    console.log("Giden veri:", formattedData);

    try {
      await createSupportTicket(formattedData);
      toast.success("Destek talebi gönderildi");
      setFormData({
        subject: '',
        description: '',
        category: 'BILLING',
        priority: 'MEDIUM',
        customerId: customerId,
        userType: role === 'ROLE_SELLER' ? 'seller' : 'customer'
      });
    } catch (err) {
      toast.error(err.message || "Hata oluştu");
    }
  };

  // Utility functions
  const getStatusConfig = (status) => {
    const configs = {
      RESOLVED: { icon: <FaCheckCircle />, text: 'Çözüldü', color: 'text-green-600 bg-green-100' },
      PENDING: { icon: <FaClock />, text: 'İnceleniyor', color: 'text-yellow-600 bg-yellow-100' },
      CLOSED: { icon: <FaTimesCircle />, text: 'Kapatıldı', color: 'text-gray-600 bg-gray-100' }
    };
    return configs[status] || configs.PENDING;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      HIGH: { text: 'Yüksek Öncelik', color: 'text-red-700 bg-red-100 border-red-200' },
      NORMAL: { text: 'Normal', color: 'text-blue-700 bg-blue-100 border-blue-200' },
      LOW: { text: 'Düşük Öncelik', color: 'text-green-700 bg-green-100 border-green-200' }
    };
    return configs[priority] || configs.NORMAL;
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue.toLowerCase()) || { label: 'Genel', icon: <FaHeadset /> };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto md:px-6 px-2">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <FaHeadset className="text-white text-2xl" />
          </div>
          <h1 className=" text-2xl md:text-3xl font-bold text-gray-800 mb-2">Destek Merkezi</h1>
          <p className="text-gray-600">Size nasıl yardımcı olabiliriz?</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('new')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${activeTab === 'new'
                  ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaPaperPlane className="text-sm" />
                  <span>Yeni Talep</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${activeTab === 'history'
                  ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaHistory className="text-sm" />
                  <span>Taleplerim</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="md:p-8 px-3 py-6">
            {/* New Request Form */}
            {activeTab === 'new' && (
              <div className="space-y-8">

                {/* Category Selection - Yeniden Tasarlandı */}
                <div>
                  <h3 className="text-md md:text-xl font-semibold text-gray-800 mb-6 text-center">
                    Hangi konuda yardıma ihtiyacınız var?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <label
                        key={category.value}
                        className={`group relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${formData.category === category.value
                          ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200'
                          : `${category.color} bg-white border-gray-200 shadow-sm hover:shadow-md`
                          }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />

                        {/* Icon */}
                        <div className={`mb-4 p-3 rounded-full transition-all duration-300 ${formData.category === category.value
                          ? 'bg-orange-500 text-white'
                          : `bg-gray-100 ${category.iconColor} group-hover:bg-gray-200`
                          }`}>
                          {category.icon}
                        </div>

                        {/* Title */}
                        <h4 className={`font-semibold text-center mb-2 transition-colors duration-300 ${formData.category === category.value
                          ? 'text-orange-700'
                          : 'text-gray-800 group-hover:text-gray-900'
                          }`}>
                          {category.label}
                        </h4>

                        {/* Description */}
                        <p className={`text-sm text-center leading-relaxed transition-colors duration-300 ${formData.category === category.value
                          ? 'text-orange-600'
                          : 'text-gray-500 group-hover:text-gray-600'
                          }`}>
                          {category.description}
                        </p>

                        {/* Selected Indicator */}
                        {formData.category === category.value && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white text-sm" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subject and Priority */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Konu Başlığı
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 outline-none"
                          placeholder="Sorununuzu kısaca özetleyin"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aciliyet Durumu
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 outline-none"
                      >
                        <option value="LOW">Düşük - Normal çalışma saatleri içinde</option>
                        <option value="NORMAL">Normal - 24 saat içinde</option>
                        <option value="HIGH">Yüksek - Acil müdahale gerekli</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detaylı Açıklama
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none outline-none"
                      placeholder="Sorununuzu detaylı açıklayın..."
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Minimum 20 karakter gerekli
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 md:py-4 md:px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                        }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Gönderiliyor...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <FaPaperPlane />
                          <span>Destek Talebini Gönder</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Support History */}
            {activeTab === 'history' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Destek Talepleriniz
                  </h3>
                  <span className="text-sm text-gray-500">
                    Toplam {supportHistory.length} talep
                  </span>
                </div>

                {supportHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHistory className="text-gray-300 text-5xl mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-500 mb-2">
                      Henüz destek talebiniz bulunmuyor
                    </h4>
                    <p className="text-gray-400 mb-6">
                      İlk destek talebinizi oluşturmak için "Yeni Talep" sekmesini kullanabilirsiniz.
                    </p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                      Yeni Talep Oluştur
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportHistory.map((ticket) => {
                      const statusConfig = getStatusConfig(ticket.status);
                      const priorityConfig = getPriorityConfig(ticket.priority);
                      const categoryInfo = getCategoryInfo(ticket.category);

                      return (
                        <div
                          key={ticket.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="text-lg text-gray-600">
                                  {categoryInfo.icon}
                                </div>
                                <h4 className="text-lg font-semibold text-gray-800">
                                  {ticket.subject}
                                </h4>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span>#{ticket.id.toString().padStart(6, '0')}</span>
                                <span>•</span>
                                <span>{getCategoryInfo(ticket.category).label}</span>
                                <span>•</span>
                                <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${priorityConfig.color}`}>
                                {priorityConfig.text}
                              </span>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                                {statusConfig.icon}
                                <span>{statusConfig.text}</span>
                              </div>
                            </div>
                          </div>

                          {ticket.response && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FaUser className="text-blue-600 text-sm" />
                                <span className="text-sm font-semibold text-blue-800">
                                  Destek Ekibi Yanıtı
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 leading-relaxed">
                                {ticket.response}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Acil durumlar için: <strong>0850 XXX XX XX</strong> | Çalışma saatleri: 09:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
};
export default SupportAndComplaint;