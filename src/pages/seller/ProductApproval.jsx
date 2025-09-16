import { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Clock, Package, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { getWaitingApprovalProducts, approveProduct, rejectProduct } from '../../services/managerProductService';

const ProductApproval = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sellerFilter, setSellerFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, productId: null });
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWaitingProducts = async () => {
      try {
        setLoading(true);
        const data = await getWaitingApprovalProducts();
        setProducts(data);
        console.log(data)
      } catch (err) {
        toast.error(err.message || "Ürünler alınamadı");
      } finally {
        setLoading(false);
      }
    };
    fetchWaitingProducts();
  }, []);


  const handleApprove = async (productId) => {
    try {
      await approveProduct(productId);
      toast.success("Ürün başarıyla onaylandı");

      // Status güncelle
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, approvalStatus: "APPROVED" } : p
        )
      );
      setSelectedProduct(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = (productId) => {
    setConfirmDialog({ open: true, type: 'reject', productId });
  };


  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    if (sellerFilter !== 'ALL') {
      filtered = filtered.filter(product => product.sellerId.toString() === sellerFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, statusFilter, sellerFilter, products]);

  const getStatusBadge = (approvalStatus) => {
    switch (approvalStatus) {
      case 'BEKLIYOR':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
            <Clock className="w-4 h-4 mr-1" />
            Beklemede
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
            <Check className="w-4 h-4 mr-1" />
            Onaylandı
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
            <X className="w-4 h-4 mr-1" />
            Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  const getActionTypeBadge = (actionType) => {
    switch (actionType) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            Yeni Ürün
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
            Güncelleme
          </span>
        );
      default:
        return null;
    }
  };

  const showDetails = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const confirmApprove = async () => {
    try {
      setLoading(true);
     
      setProducts(products.map(p =>
        p.id === confirmDialog.productId
          ? { ...p, status: 'APPROVED' }
          : p
      ));
      toast.success("Ürün başarıyla onaylandı!");
      setConfirmDialog({ open: false, type: null, productId: null });
    } catch (error) {
      toast.error("Onaylama işlemi başarısız oldu!");
    } finally {
      setLoading(false);
    }
  };

 const confirmReject = async () => {
  if (!rejectionReason.trim()) {
    toast.error("Lütfen reddetme gerekçesini giriniz.");
    return;
  }

  try {
    setLoading(true);
  
    await rejectProduct(confirmDialog.productId, rejectionReason);
    toast.success("Ürün başarıyla reddedildi!");

    setProducts(products.map(p => 
      p.id === confirmDialog.productId 
        ? { ...p, approvalStatus: 'REJECTED', rejectionReason }
        : p
    ));

    setConfirmDialog({ open: false, type: null, productId: null });
    setRejectionReason("");
  } catch (error) {
    toast.error(error.message || "Reddetme işlemi başarısız oldu!");
  } finally {
    setLoading(false);
  }
};


  // Benzersiz satıcıları al
  const uniqueSellers = [...new Map(products.map(p => [p.sellerId, { id: p.sellerId, name: p.sellerName }])).values()];

  const statistics = {
    pending: products.filter(p => p.approvalStatus === 'BEKLIYOR').length,
    approved: products.filter(p => p.approvalStatus === 'APPROVED').length,
    rejected: products.filter(p => p.approvalStatus === 'REJECTED').length,
    total: products.length
  };

  return (
    <div className="min-h-screen md:p-6 px-3 py-6 bg-gray-50">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Ürün Onayları</h1>
        <p className="mt-2 text-gray-600">Satıcılar tarafından eklenen ve güncellenen ürünleri inceleyin ve onaylayın</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Beklemede</p>
              <p className="text-3xl font-semibold text-gray-900">{statistics.pending}</p>
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
              <p className="text-3xl font-semibold text-gray-900">{statistics.approved}</p>
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
              <p className="text-3xl font-semibold text-gray-900">{statistics.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam</p>
              <p className="text-3xl font-semibold text-gray-900">{statistics.total}</p>
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
                placeholder="Ürün adı, marka veya satıcı ile arayın..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="PENDING">Beklemede</option>
              <option value="APPROVED">Onaylandı</option>
              <option value="REJECTED">Reddedildi</option>
            </select>
          </div>

          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
            >
              <option value="ALL">Tüm Satıcılar</option>
              {uniqueSellers.map(seller => (
                <option key={seller.id} value={seller.id.toString()}>
                  {seller.name}
                </option>
              ))}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satıcı</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem Tipi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{product.sellerName}</div>
                      <div className="text-sm text-gray-500">{product.sellerCompanyName}</div>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price?.toLocaleString()} TL</div>
                    <div className="text-sm text-gray-500">Stok: {product.stockQuantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActionTypeBadge(product.actionType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.approvalStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(product.submitDate).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => showDetails(product)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        İncele
                      </button>

                      {product.approvalStatus === 'BEKLIYOR' && (
                        <>
                          <button
                            onClick={() => setConfirmDialog({ open: true, type: 'reject', productId: product.id })}
                            className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reddet
                          </button>

                          <button
                            onClick={() => handleApprove(product.id)}
                            className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Onayla
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Filtreye uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detay Modalı */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Ürün Detay İncelemesi</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ürün Bilgileri */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ürün Bilgileri</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ürün Adı</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedProduct.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Marka</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedProduct.brand}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Fiyat</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedProduct.price?.toLocaleString()} TL</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Stok</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedProduct.stockQuantity}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Kategori</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.categoryName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Açıklama</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Satıcı Bilgileri */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Satıcı Bilgileri</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Satıcı Adı</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.sellerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Şirket Adı</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.sellerCompanyName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ürün Görselleri */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ürün Görselleri</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProduct.imageUrls.map((imageUrl, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imageUrl}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* İşlem Bilgileri */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">İşlem Bilgileri</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">İşlem Tipi:</span>
                        {getActionTypeBadge(selectedProduct.actionType)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Durum:</span>
                        {getStatusBadge(selectedProduct.approvalStatus)}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Gönderilme Tarihi</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedProduct.submitDate).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Nedeni */}
              {selectedProduct.approvalStatus === 'REJECTED' && selectedProduct.rejectionReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Red Nedeni:
                  </h4>
                  <p className="text-sm text-red-700">{selectedProduct.rejectionReason}</p>
                </div>
              )}

              {/* Modal İşlem Butonları */}
              {selectedProduct.approvalStatus === 'BEKLIYOR' && (
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setConfirmDialog({ open: true, type: 'reject', productId: selectedProduct.id })}
                    className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reddet
                  </button>

                  <button
                    onClick={() => handleApprove(selectedProduct.id)}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Onayla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onay Dialogu */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {confirmDialog.type === 'approve' ? 'Ürünü Onayla' : 'Ürünü Reddet'}
            </h3>

            {confirmDialog.type === 'reject' ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Bu ürünü reddetme sebebinizi belirtiniz:
                </p>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mb-4 text-sm"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Örn: Ürün görselleri yetersiz, açıklama eksik..."
                />
              </>
            ) : (
              <p className="text-sm text-gray-600 mb-6">
                Bu ürünü onaylamak istediğinizden emin misiniz? Onaylandıktan sonra ürün aktif hale gelecektir.
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setConfirmDialog({ open: false, type: null, productId: null });
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={confirmDialog.type === 'approve' ? confirmApprove : confirmReject}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${confirmDialog.type === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </div>
                ) : (
                  confirmDialog.type === 'approve' ? 'Onayla' : 'Reddet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApproval;