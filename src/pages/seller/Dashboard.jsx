// src/pages/seller/Dashboard.jsx (veya nerede saklamak istiyorsanız)
import AdminText from "../../shared/Text/AdminText";
import { useState, useEffect } from "react";
import { FaBoxes, FaChartLine, FaDollarSign, FaShoppingCart, FaStore, FaEye } from "react-icons/fa"; // İkonlar için
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Demo veri (gerçek uygulamada API'den çekilir)
  const [dashboardData, setDashboardData] = useState({
    totalSales: 750000, // Toplam Ciro
    totalOrders: 120,   // Toplam Sipariş Sayısı
    totalProducts: 50,  // Toplam Ürün Sayısı
    pendingOrders: 10,  // Bekleyen Sipariş Sayısı
    lowStockProducts: 5, // Düşük Stoklu Ürün Sayısı
    dailyVisitors: 1500, // Günlük Ziyaretçi Sayısı
    recentOrders: [
      { id: "ORD-2025-001", customerName: "Ali Can", amount: 1250, status: "pending", date: "2025-05-31" },
      { id: "ORD-2025-002", customerName: "Büşra Çelik", amount: 3200, status: "confirmed", date: "2025-05-30" },
      { id: "ORD-2025-003", customerName: "Cem Yılmaz", amount: 500, status: "shipped", date: "2025-05-29" },
    ],
    popularProducts: [
      { id: "PROD-001", name: "Akıllı Telefon X", sales: 25, views: 1500, price: 20000 },
      { id: "PROD-002", name: "Kablosuz Kulaklık V", sales: 18, views: 1200, price: 3500 },
      { id: "PROD-003", name: "Dizüstü Bilgisayar Z", sales: 12, views: 1000, price: 30000 },
    ]
  });

  // Stil değişkenleri (Orders bileşeninizle uyumlu)
  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow bg-white';
  const buttonStyle = "bg-[var(--color-orange)] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity";

  // Durum renkleri (Orders bileşeninizden alınmıştır)
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

  // Gerçek uygulamada, bu useEffect içinde API çağrıları yapardınız.
  useEffect(() => {
    // Örneğin:
    // fetch('/api/dashboard-stats')
    //   .then(res => res.json())
    //   .then(data => setDashboardData(data));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50"> {/* Arka plan rengi eklendi */}
      <AdminText>Yönetim Paneli</AdminText>

      {/* Genel İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className={`${boxStyle} flex items-center justify-between`}>
          <div>
            <div className="text-xl font-bold text-[var(--color-orange)]">₺{dashboardData.totalSales.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Toplam Ciro</div>
          </div>
          <FaDollarSign className="text-4xl text-green-500 opacity-70" />
        </div>
        <div className={`${boxStyle} flex items-center justify-between`}>
          <div>
            <div className="text-xl font-bold text-blue-600">{dashboardData.totalOrders}</div>
            <div className="text-sm text-gray-600">Toplam Sipariş</div>
          </div>
          <FaShoppingCart className="text-4xl text-blue-500 opacity-70" />
        </div>
        <div className={`${boxStyle} flex items-center justify-between`}>
          <div>
            <div className="text-xl font-bold text-purple-600">{dashboardData.totalProducts}</div>
            <div className="text-sm text-gray-600">Toplam Ürün</div>
          </div>
          <FaBoxes className="text-4xl text-purple-500 opacity-70" />
        </div>
        <div className={`${boxStyle} flex items-center justify-between`}>
          <div>
            <div className="text-xl font-bold text-yellow-600">{dashboardData.pendingOrders}</div>
            <div className="text-sm text-gray-600">Bekleyen Sipariş</div>
          </div>
          <FaChartLine className="text-4xl text-yellow-500 opacity-70" />
        </div>
      </div>

      {/* Ana İçerik Alanı - Son Siparişler, Popüler Ürünler, Uyarılar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Son Siparişler Kartı */}
        <div className={`${boxStyle} lg:col-span-2`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Son Siparişler</h3>
          {dashboardData.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₺{order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-[var(--color-orange)] hover:text-orange-900">Detay</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Henüz yeni sipariş bulunmamaktadır.</p>
          )}
        <div className="mt-4 text-right">
          <Link to="/seller/orders">
            <button className={buttonStyle + " px-6 py-2"}>
              Tüm Siparişleri Görüntüle
            </button>
          </Link>
        </div>
        </div>

        {/* Uyarılar ve Hızlı Eylemler */}
        <div className={`${boxStyle}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Uyarılar & Hızlı Eylemler</h3>
          <div className="space-y-4">
            {dashboardData.lowStockProducts > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-center justify-between">
                <div>
                  <div className="flex items-center text-red-700">
                    <FaBoxes className="mr-2" />
                    <span className="font-medium">{dashboardData.lowStockProducts} Düşük Stoklu Ürün!</span>
                  </div>
                  <p className="text-sm text-red-600">Hızlıca stoklarınızı güncelleyin.</p>
                </div>
                <button className="text-red-700 hover:text-red-900 text-sm font-medium">Git</button>
              </div>
            )}
            {dashboardData.pendingOrders > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-center justify-between">
                <div>
                  <div className="flex items-center text-yellow-700">
                    <FaShoppingCart className="mr-2" />
                    <span className="font-medium">{dashboardData.pendingOrders} Bekleyen Sipariş!</span>
                  </div>
                  <p className="text-sm text-yellow-600">Hemen onaylamanız gerekiyor.</p>
                </div>
                <button className="text-yellow-700 hover:text-yellow-900 text-sm font-medium">Git</button>
              </div>
            )}

            {/* Hızlı Eylem Butonları */}
            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
            <Link to={`/seller/products`}>
              <button className={`${buttonStyle} w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center`}>
                <FaBoxes className="mr-2" /> Yeni Ürün Ekle
              </button>
            </Link>
            <Link to={`/seller/store`}>
              <button className={`${buttonStyle} w-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center`}>
                <FaStore className="mr-2" /> Mağazamı Görüntüle
              </button>
            </Link>
          </div>

          </div>
        </div>
      </div>

      {/* Popüler Ürünler ve Günlük Ziyaretçiler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Popüler Ürünler */}
        <div className={boxStyle}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popüler Ürünler</h3>
          {dashboardData.popularProducts.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.popularProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Satış: {product.sales} | Görüntüleme: {product.views}</p>
                  </div>
                  <span className="font-semibold text-[var(--color-orange)]">₺{product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Henüz popüler ürün bulunmamaktadır.</p>
          )}
        </div>

        {/* Günlük Ziyaretçiler (Basit Metin) */}
        <div className={boxStyle}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Günlük Ziyaretçi</h3>
          <div className="flex items-center justify-center h-full min-h-[150px] bg-gray-50 rounded-lg">
            <div className="text-center">
              <FaEye className="text-6xl text-blue-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-gray-800">{dashboardData.dailyVisitors.toLocaleString()}</div>
              <div className="text-gray-600">Bugünlük Ziyaretçi</div>
            </div>
          </div>
          {/* Buraya daha sonra bir grafik kütüphanesi (örn. Chart.js, Recharts) ile gerçek bir grafik eklenebilir */}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;