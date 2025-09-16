import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiClock, FiMessageCircle, FiPackage, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { BsThreeDots, BsChevronDown } from 'react-icons/bs';

const SellerQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockQuestions = [
    {
      id: 1,
      productId: 101,
      productName: "iPhone 15 Pro Max",
      productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
      customerName: "Ahmet Yılmaz",
      questionText: "Bu ürünün garanti süresi kaç yıl? Uluslararası garanti var mı?",
      status: "BEKLIYOR",
      createdAt: "2024-01-15T10:30:00Z",
      answerText: null
    },
    {
      id: 2,
      productId: 102,
      productName: "Samsung Galaxy S24",
      productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
      customerName: "Zeynep Kaya",
      questionText: "Farklı renk seçenekleri mevcut mu? Stokta hangi renkler var?",
      status: "CEVAPLANMIS",
      createdAt: "2024-01-14T15:45:00Z",
      answerText: "Evet, Titanium Blue, Phantom Black ve Cream renklerinde stokumuz mevcuttur."
    },
    {
      id: 3,
      productId: 103,
      productName: "MacBook Air M3",
      productImage: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop",
      customerName: "Mehmet Demir",
      questionText: "RAM ve SSD yükseltme imkanı var mı? Fiyat farkları nelerdir?",
      status: "BEKLIYOR",
      createdAt: "2024-01-13T09:15:00Z",
      answerText: null
    },
    {
      id: 4,
      productId: 104,
      productName: "AirPods Pro 2",
      productImage: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=100&h=100&fit=crop",
      customerName: "Ayşe Öz",
      questionText: "Noise cancelling özelliği ne kadar etkili? İlk nesille karşılaştırabilir misiniz?",
      status: "REDDEDILDI",
      createdAt: "2024-01-12T14:20:00Z",
      answerText: null
    },
    {
      id: 5,
      productId: 101,
      productName: "iPhone 15 Pro Max",
      productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
      customerName: "Can Arslan",
      questionText: "Kamera özellikleri hakkında detaylı bilgi alabilir miyim?",
      status: "CEVAPLANMIS",
      createdAt: "2024-01-11T16:30:00Z",
      answerText: "48MP Ana kamera, 12MP Ultra Wide, 12MP Telephoto lens ile profesyonel fotoğraflar çekebilirsiniz."
    }
  ];

  const products = [...new Set(mockQuestions.map(q => ({ id: q.productId, name: q.productName })))];

  useEffect(() => {
    setQuestions(mockQuestions);
    setFilteredQuestions(mockQuestions);
  }, []);

  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    if (selectedProduct !== 'all') {
      filtered = filtered.filter(q => q.productId === parseInt(selectedProduct));
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, statusFilter, selectedProduct, questions]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'BEKLIYOR': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CEVAPLANMIS': return 'bg-green-100 text-green-800 border-green-200';
      case 'REDDEDILDI': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'BEKLIYOR': return 'Bekliyor';
      case 'CEVAPLANMIS': return 'Cevaplanmış';
      case 'REDDEDILDI': return 'Reddedildi';
      default: return status;
    }
  };

  const handleAnswerQuestion = async (questionId) => {
    if (!answerText.trim()) return;
    
    setLoading(true);
    // API call simülasyonu
    setTimeout(() => {
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, status: 'CEVAPLANMIS', answerText: answerText }
          : q
      ));
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      setAnswerText('');
      setLoading(false);
    }, 1000);
  };

  const handleRejectQuestion = async (questionId) => {
    setLoading(true);
    // API call simülasyonu
    setTimeout(() => {
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, status: 'REDDEDILDI' }
          : q
      ));
      setLoading(false);
    }, 500);
  };

  const stats = {
    total: questions.length,
    pending: questions.filter(q => q.status === 'BEKLIYOR').length,
    answered: questions.filter(q => q.status === 'CEVAPLANMIS').length,
    rejected: questions.filter(q => q.status === 'REDDEDILDI').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Soruları Yönetimi</h1>
          <p className="text-gray-600">Müşterilerinizin ürünleriniz hakkındaki sorularını yönetin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiMessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Soru</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cevaplanmış</p>
                <p className="text-2xl font-bold text-gray-900">{stats.answered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reddedilen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Soru, ürün veya müşteri adı ile ara..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="BEKLIYOR">Bekleyen</option>
                <option value="CEVAPLANMIS">Cevaplanmış</option>
                <option value="REDDEDILDI">Reddedilen</option>
              </select>
              <BsChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="all">Tüm Ürünler</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              <BsChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Sorular ({filteredQuestions.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredQuestions.map(question => (
              <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <img
                    src={question.productImage}
                    alt={question.productName}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {question.productName}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(question.status)}`}>
                            {getStatusText(question.status)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Soran:</strong> {question.customerName}
                        </p>
                        
                        <p className="text-gray-800 mb-3 leading-relaxed">
                          {question.questionText}
                        </p>

                        {question.answerText && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-green-800 mb-1">Cevabınız:</p>
                            <p className="text-green-700">{question.answerText}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-1" />
                          {formatDate(question.createdAt)}
                        </div>
                      </div>
                      
                      {question.status === 'BEKLIYOR' && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedQuestion(question);
                              setShowAnswerModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <FiCheck className="mr-1" />
                            Cevapla
                          </button>
                          <button
                            onClick={() => handleRejectQuestion(question.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                          >
                            <FiX className="mr-1" />
                            Reddet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="p-12 text-center">
                <FiMessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Soru bulunamadı</h3>
                <p className="text-gray-600">Aradığınız kriterlere uygun soru bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer Modal */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Soruyu Cevapla</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Ürün:</h4>
                <p className="text-gray-700">{selectedQuestion.productName}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Soru:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedQuestion.questionText}</p>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium text-gray-900 mb-2">Cevabınız:</label>
                <textarea
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Müşterinin sorusuna detaylı bir cevap yazın..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAnswerModal(false);
                  setSelectedQuestion(null);
                  setAnswerText('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={() => handleAnswerQuestion(selectedQuestion.id)}
                disabled={!answerText.trim() || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  'Cevabı Gönder'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerQuestionsPage;