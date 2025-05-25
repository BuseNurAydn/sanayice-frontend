import AdminText from "../../shared/Text/AdminText";
import { useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-2024-001",
      customer: {
        name: "Mehmet Kaya",
        email: "mehmet.kaya@gmail.com",
        phone: "+905551234567"
      },
      products: [
        { name: "iPhone 14 Pro", quantity: 1, price: 45000 },
        { name: "AirPods Pro", quantity: 1, price: 8500 }
      ],
      totalAmount: 53500,
      status: "pending",
      orderDate: "2024-12-15",
      shippingAddress: "Kadıköy, İstanbul",
      paymentMethod: "Kredi Kartı"
    },
    {
      id: "ORD-2024-002",
      customer: {
        name: "Ayşe Demir",
        email: "ayse.demir@gmail.com",
        phone: "+905559876543"
      },
      products: [
        { name: "Samsung Galaxy S24", quantity: 1, price: 42000 }
      ],
      totalAmount: 42000,
      status: "confirmed",
      orderDate: "2024-12-14",
      shippingAddress: "Beşiktaş, İstanbul",
      paymentMethod: "Havale/EFT"
    },
    {
      id: "ORD-2024-003",
      customer: {
        name: "Can Özkan",
        email: "can.ozkan@hotmail.com",
        phone: "+905552468135"
      },
      products: [
        { name: "MacBook Air M2", quantity: 1, price: 35000 },
        { name: "Magic Mouse", quantity: 1, price: 2500 }
      ],
      totalAmount: 37500,
      status: "shipped",
      orderDate: "2024-12-10",
      shippingAddress: "Çankaya, Ankara",
      paymentMethod: "Kredi Kartı"
    },
    {
      id: "ORD-2024-004",
      customer: {
        name: "Zeynep Yılmaz",
        email: "zeynep.yilmaz@gmail.com",
        phone: "+905557891234"
      },
      products: [
        { name: "iPad Pro 12.9", quantity: 1, price: 28000 }
      ],
      totalAmount: 28000,
      status: "delivered",
      orderDate: "2024-12-05",
      shippingAddress: "Konak, İzmir",
      paymentMethod: "Kapıda Ödeme"
    },
    {
      id: "ORD-2024-005",
      customer: {
        name: "Emre Şahin",
        email: "emre.sahin@outlook.com",
        phone: "+905553216547"
      },
      products: [
        { name: "PlayStation 5", quantity: 1, price: 18000 }
      ],
      totalAmount: 18000,
      status: "cancelled",
      orderDate: "2024-12-12",
      shippingAddress: "Çukurova, Adana",
      paymentMethod: "Kredi Kartı"
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow bg-white';
  const buttonStyle = "bg-[var(--color-orange)] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity";
  const inputStyle = 'border-gray-200 outline-none border px-3 py-2 rounded-lg bg-gray-50';

  // Durum renkleri
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Durum çevirisi
  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Beklemede",
      confirmed: "Onaylandı",
      shipped: "Kargoya Verildi",
      delivered: "Teslim Edildi",
      cancelled: "İptal Edildi"
    };
    return statusTexts[status] || status;
  };

  // Filtrelenmiş siparişler
  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  // Sipariş durumu güncelleme
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    
   
    
    // Burada gerçek uygulamada API çağrısı yapılacak
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-[var(--color-light)]">
      <div className="max-w-7xl mx-auto">
        <AdminText>Siparişler</AdminText>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div className={boxStyle + " text-center"}>
            <div className="text-2xl font-bold text-[var(--color-orange)]">{stats.total}</div>
            <div className="text-sm text-gray-600">Toplam Sipariş</div>
          </div>
          <div className={boxStyle + " text-center"}>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Beklemede</div>
          </div>
          <div className={boxStyle + " text-center"}>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Onaylı</div>
          </div>
          <div className={boxStyle + " text-center"}>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            <div className="text-sm text-gray-600">Kargoda</div>
          </div>
          <div className={boxStyle + " text-center"}>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Teslim Edildi</div>
          </div>
          <div className={boxStyle + " text-center"}>
            <div className="text-2xl font-bold text-[var(--color-orange)]">₺{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Toplam Gelir</div>
          </div>
        </div>

        {/* Filtreler */}
        <div className={boxStyle + " mt-6"}>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-medium text-gray-700">Durum Filtresi:</span>
            <select 
              className={inputStyle}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tüm Siparişler</option>
              <option value="pending">Beklemede</option>
              <option value="confirmed">Onaylı</option>
              <option value="shipped">Kargoda</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
            <div className="text-sm text-gray-600">
              {filteredOrders.length} sipariş gösteriliyor
            </div>
          </div>
        </div>

        {/* Siparişler Listesi */}
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className={boxStyle}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Sol taraf - Sipariş bilgileri */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Müşteri: <span className="text-gray-900 font-medium">{order.customer.name}</span></p>
                      <p className="text-gray-600">E-posta: <span className="text-gray-900">{order.customer.email}</span></p>
                      <p className="text-gray-600">Telefon: <span className="text-gray-900">{order.customer.phone}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tarih: <span className="text-gray-900">{order.orderDate}</span></p>
                      <p className="text-gray-600">Teslimat: <span className="text-gray-900">{order.shippingAddress}</span></p>
                      <p className="text-gray-600">Ödeme: <span className="text-gray-900">{order.paymentMethod}</span></p>
                    </div>
                  </div>

                  {/* Ürünler */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ürünler:</p>
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{product.name} x{product.quantity}</span>
                          <span className="font-medium">₺{product.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Toplam:</span>
                        <span className="text-[var(--color-orange)]">₺{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ taraf - Aksiyonlar */}
                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  <button 
                    className={buttonStyle}
                    onClick={() => setSelectedOrder(order)}
                  >
                    Detay Görüntüle
                  </button>
                  
                  {order.status === 'pending' && (
                    <>
                      <button 
                        className={buttonStyle + " bg-green-600 hover:bg-green-700"}
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      >
                        Siparişi Onayla
                      </button>
                      <button 
                        className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        İptal Et
                      </button>
                    </>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <>
                      <button 
                        className={buttonStyle + " bg-purple-600 hover:bg-purple-700"}
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                      >
                        Kargoya Ver
                      </button>
                      <button 
                        className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        İptal Et
                      </button>
                    </>
                  )}
                  
                  {order.status === 'shipped' && (
                    <button 
                      className={buttonStyle + " bg-green-600 hover:bg-green-700"}
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      Teslim Edildi İşaretle
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className={boxStyle + " mt-6 text-center py-12"}>
            <div className="text-gray-500 text-lg">Bu filtre için sipariş bulunamadı.</div>
          </div>
        )}
      </div>

      {/* Sipariş Detay Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Sipariş Detayları</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Sipariş Bilgileri</h3>
                    <p className="text-sm text-gray-600">Sipariş No: <span className="text-gray-900">{selectedOrder.id}</span></p>
                    <p className="text-sm text-gray-600">Tarih: <span className="text-gray-900">{selectedOrder.orderDate}</span></p>
                    <p className="text-sm text-gray-600">Durum: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Müşteri Bilgileri</h3>
                    <p className="text-sm text-gray-600">Ad Soyad: <span className="text-gray-900">{selectedOrder.customer.name}</span></p>
                    <p className="text-sm text-gray-600">E-posta: <span className="text-gray-900">{selectedOrder.customer.email}</span></p>
                    <p className="text-sm text-gray-600">Telefon: <span className="text-gray-900">{selectedOrder.customer.phone}</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Teslimat Bilgileri</h3>
                  <p className="text-sm text-gray-600">Adres: <span className="text-gray-900">{selectedOrder.shippingAddress}</span></p>
                  <p className="text-sm text-gray-600">Ödeme Yöntemi: <span className="text-gray-900">{selectedOrder.paymentMethod}</span></p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Ürün Detayları</h3>
                  <div className="border rounded-lg">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">Adet: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₺{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-gray-50 font-semibold flex justify-between">
                      <span>Toplam Tutar:</span>
                      <span className="text-[var(--color-orange)]">₺{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button 
                      className={buttonStyle + " bg-green-600 hover:bg-green-700"}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    >
                      Siparişi Onayla
                    </button>
                    <button 
                      className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      İptal Et
                    </button>
                  </>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <>
                    <button 
                      className={buttonStyle + " bg-purple-600 hover:bg-purple-700"}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    >
                      Kargoya Ver
                    </button>
                    <button 
                      className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      İptal Et
                    </button>
                  </>
                )}
                {selectedOrder.status === 'shipped' && (
                  <button 
                    className={buttonStyle + " bg-green-600 hover:bg-green-700"}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                  >
                    Teslim Edildi İşaretle
                  </button>
                )}
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className={buttonStyle + " bg-gray-500 hover:bg-gray-600"}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;