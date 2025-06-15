import AdminText from "../../shared/Text/AdminText";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../services/sellerOrdersService";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow bg-white';
  const buttonStyle = "bg-[var(--color-orange)] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity";
  const inputStyle = 'border-gray-200 outline-none border px-3 py-2 rounded-lg bg-gray-50';

  const getToken = () => localStorage.getItem("token");
  const fetchSellerOrders = async () => {
    const token = getToken();

    const response = await fetch("/api/seller/orders/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Siparişler alınamadı");
    }

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    fetchSellerOrders()
      .then(data => setOrders(data))

      .catch(error => {
        console.error(error);
      });
  }, []);

  console.log(orders)

  // Durum renkleri
  const getStatusColor = (overallStatus) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELED: "bg-red-100 text-red-800"
    };
    return colors[overallStatus] || "bg-gray-100 text-gray-800";
  };

  // Durum çevirisi
  const getStatusText = (overallStatus) => {
    const statusTexts = {
      PENDING: "Beklemede",
      CONFIRMED: "Onaylandı",
      SHIPPED: "Kargoya Verildi",
      DELIVERED: "Teslim Edildi",
      CANCELED: "İptal Edildi"
    };
    return statusTexts[overallStatus] || "Bilinmeyen Durum";
  };

  // Filtrelenmiş siparişler
  const filteredOrders = selectedStatus === "all"
    ? orders
    : orders.filter(order => order.overallStatus?.toUpperCase() === selectedStatus?.toUpperCase());

const handleOrderUpdate = async (orderId, action) => {
  const newStatusMap = {
    confirm: "CONFIRMED",
    cancel: "CANCELED",
    ship: "SHIPPED",
    deliver: "DELIVERED",
  };

  const newStatus = newStatusMap[action];

  try {
    await updateOrderStatus(orderId, action);
    toast.success("Durum güncellendi!");

    // Güncel siparişleri yeniden çek
   // Sipariş listesini güncelle
    const updatedOrders = await fetchSellerOrders();
    setOrders(updatedOrders);

    // Seçili sipariş detay sayfası açık ise güncelle
    const newStatus = newStatusMap[action];
    if (selectedOrder?.id === orderId && newStatus) {
      setSelectedOrder(prev => ({ ...prev, overallStatus: newStatus }));
    }

  } catch (err) {
    toast.error("Sipariş durumu güncellenemedi.");
  }
};

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.overallStatus === 'PENDING').length,
    confirmed: orders.filter(o => o.overallStatus === 'CONFIRMED').length,
    shipped: orders.filter(o => o.overallStatus === 'SHIPPED').length,
    delivered: orders.filter(o => o.overallStatus === 'DELIVERED').length,
   totalRevenue: orders
    .filter(o => o.overallStatus === 'DELIVERED')
    .reduce((sum, order) => {
      const orderTotal = order.orderItems?.reduce(
        (orderSum, item) => orderSum + item.unitPrice * item.quantity,
        0
      );
      return sum + orderTotal;
    }, 0),

  };

console.log(stats)

  return (
    <div className="min-h-screen">
      <div>
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
              <option value="PENDING">Beklemede</option>
              <option value="CONFIRMED">Onaylı</option>
              <option value="SHIPPED">Kargoda</option>
              <option value="DELIVERED">Teslim Edildi</option>
              <option value="CANCELED">İptal Edildi</option>
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
                    <h3 className="text-lg font-semibold text-gray-900">#{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.overallStatus)}`}
                    >
                      {order.overallStatus}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Müşteri: <span className="text-gray-900 font-medium">{order.customerName}</span></p>
                      <p className="text-gray-600">Email: <span className="text-gray-900">{order.customer?.email}</span></p>
                      <p className="text-gray-600">Telefon: <span className="text-gray-900">{order.customer?.phone}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tarih: <span className="text-gray-900">{order.orderDate}</span></p>
                      <p className="text-gray-600">Teslimat: <span className="text-gray-900">{order.shippingAddress}</span></p>
                      <p className="text-gray-600">Ödeme: <span className="text-gray-900">{order?.paymentMethod}</span></p>
                    </div>
                  </div>

                  {/* Ürünler */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ürünler:</p>
                    <div className="space-y-1">
                      {order.orderItems.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{product.productName} x {product.quantity}</span>
                          <span className="font-medium">
                            ₺{Number(product.totalPrice || 0).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Toplam:</span>
                        <span className="text-[var(--color-orange)]">
                          ₺{order.orderItems.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0).toLocaleString()}
                        </span>
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

                  {order.overallStatus === 'PENDING' && (
                    <>
                      <button
                        className={`${buttonStyle} bg-green-600 hover:bg-green-700`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderUpdate(order.orderId, 'confirm');
                        }}
                      >
                        Siparişi Onayla
                      </button>
                      <button
                        className={`${buttonStyle} bg-red-600 hover:bg-red-700`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderUpdate(order.orderId, 'cancel');
                        }}
                      >
                        İptal Et
                      </button>
                    </>
                  )}

                  {order.overallStatus === 'CONFIRMED' && (
                    <>
                      <button
                        className={`${buttonStyle} bg-purple-600 hover:bg-purple-700`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderUpdate(order.orderId, 'ship');
                        }}
                      >
                        Kargoya Ver
                      </button>
                      <button
                        className={`${buttonStyle} bg-red-600 hover:bg-red-700`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderUpdate(order.orderId, 'cancel');
                        }}
                      >
                        İptal Et
                      </button>
                    </>
                  )}

                  {order.overallStatus === 'SHIPPED' && (
                    <button
                      className={`${buttonStyle} bg-green-600 hover:bg-green-700`}
                      onClick={() => handleOrderUpdate(order.orderId, 'deliver')}
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
                    <p className="text-sm text-gray-600">Sipariş No: <span className="text-gray-900">{selectedOrder.orderNumber}</span></p>
                    <p className="text-sm text-gray-600">Tarih: <span className="text-gray-900">{selectedOrder.orderDate}</span></p>
                    <p className="text-sm text-gray-600">Durum:
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.overallStatus)}`}>
                        {getStatusText(selectedOrder.overallStatus)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Müşteri Bilgileri</h3>
                    <p className="text-sm text-gray-600">Ad Soyad: <span className="text-gray-900">{selectedOrder.customerName}</span></p>
                    <p className="text-sm text-gray-600">E-posta: <span className="text-gray-900">{selectedOrder.customer?.email}</span></p>
                    <p className="text-sm text-gray-600">Telefon: <span className="text-gray-900">{selectedOrder.customer?.phone}</span></p>
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
                    {selectedOrder.orderItems?.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-gray-600">Adet: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₺{product.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-gray-50 font-semibold flex justify-between">
                      <span>Toplam Tutar:</span>
                      <span className="text-[var(--color-orange)]"> ₺{selectedOrder.orderItems?.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {selectedOrder.overallStatus === 'PENDING' && (
                  <>
                    <button
                      className={buttonStyle + " bg-green-600 hover:bg-green-700"}
                      onClick={() => handleOrderUpdate(selectedOrder.orderId, 'confirm')}
                    >
                      Siparişi Onayla
                    </button>
                    <button
                      className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                      onClick={() => handleOrderUpdate(selectedOrder.orderId, 'cancel')}
                    >
                      İptal Et
                    </button>
                  </>
                )}
                {selectedOrder.overallStatus === 'CONFIRMED' && (
                  <>
                    <button
                      className={buttonStyle + " bg-purple-600 hover:bg-purple-700"}
                      onClick={() => handleOrderUpdate(selectedOrder.orderId, 'ship')}
                    >
                      Kargoya Ver
                    </button>
                    <button
                      className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                      onClick={() => handleOrderUpdate(selectedOrder.orderId, 'cancel')}
                    >
                      İptal Et
                    </button>
                  </>
                )}
                {selectedOrder.overallStatus === 'SHIPPED' && (
                  <>
                  <button
                    className={buttonStyle + " bg-green-600 hover:bg-green-700"}
                    onClick={() => handleOrderUpdate(selectedOrder.orderId, 'deliver')}
                  >
                    Teslim Edildi İşaretle
                  </button>
                   <button
                      className={buttonStyle + " bg-red-600 hover:bg-red-700"}
                      onClick={() => handleOrderUpdate(selectedOrder.orderId, 'cancel')}
                    >
                      İptal Et
                    </button>
                    </>
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