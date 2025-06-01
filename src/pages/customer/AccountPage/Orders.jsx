// src/components/Orders.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaShippingFast, FaTimesCircle, FaUndo } from 'react-icons/fa'; // Yeni ikonlar

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "Tüm Siparişler", icon: <FaBoxOpen /> },
    { key: "ongoing", label: "Devam Edenler", icon: <FaShippingFast /> },
    { key: "cancelled", label: "İptaller", icon: <FaTimesCircle /> },
    { key: "returned", label: "İadeler", icon: <FaUndo /> },
  ];

  // Sahte sipariş verileri (gerçek uygulamada API'den gelecek)
  const fakeOrders = [
    {
      id: "123456789",
      date: "2024-05-10",
      status: "Teslim Edildi",
      type: "all",
      product: {
        name: "Kadın Siyah Sneaker Ayakkabı - Rahat ve Şık",
        image: "https://via.placeholder.com/100x100?text=Sneaker",
        price: "749.99 TL"
      },
    },
    {
      id: "987654321",
      date: "2024-05-28",
      status: "Kargoya Verildi",
      type: "ongoing",
      product: {
        name: "Erkek Mavi Polo Yaka T-Shirt - %100 Pamuk",
        image: "https://via.placeholder.com/100x100?text=T-Shirt",
        price: "299.00 TL"
      },
    },
    {
      id: "112233445",
      date: "2024-05-01",
      status: "İptal Edildi",
      type: "cancelled",
      product: {
        name: "Bluetooth 5.0 Kablosuz Kulaklık - Gürültü Engelleme",
        image: "https://via.placeholder.com/100x100?text=Kulaklık",
        price: "1250.00 TL"
      },
    },
    {
      id: "667788990",
      date: "2024-04-15",
      status: "İade Edildi",
      type: "returned",
      product: {
        name: "15.6 İnç Laptop Çantası - Su Geçirmez Kumaş",
        image: "https://via.placeholder.com/100x100?text=Laptop+Çantası",
        price: "450.00 TL"
      },
    },
    {
      id: "554433221",
      date: "2024-06-01",
      status: "Sipariş Onaylandı",
      type: "ongoing",
      product: {
        name: "Akıllı Saat - Kalp Atış Hızı Ölçerli",
        image: "https://via.placeholder.com/100x100?text=Akıllı+Saat",
        price: "2499.00 TL"
      },
    },
  ];

  const filteredOrders =
    activeTab === "all"
      ? fakeOrders
      : fakeOrders.filter((order) => order.type === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case "Teslim Edildi":
        return "text-green-600";
      case "Kargoya Verildi":
      case "Sipariş Onaylandı":
        return "text-blue-600";
      case "İptal Edildi":
        return "text-red-600";
      case "İade Edildi":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md"> {/* Ana konteyner için gölge ve padding */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h2> {/* Başlık eklendi */}

      {/* Sekmeler */}
      <div className="flex flex-wrap gap-4 md:gap-8 border-b border-gray-200 pb-4 mb-6"> {/* Daha fazla boşluk, responsive düzen */}
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 pb-2 text-sm md:text-base font-semibold transition-colors duration-300
              ${activeTab === tab.key
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-orange-600"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Siparişler Listesi */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-3/4">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-24 h-24 object-cover rounded-md border border-gray-100"
                />
                <div className="flex-1">
                  <p className="text-base text-gray-800 font-medium mb-1 break-words">
                    {order.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sipariş No: <span className="font-semibold">{order.id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Tarih: {order.date}
                  </p>
                  <p className={`text-sm font-bold mt-1 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 w-full md:w-1/4">
                <p className="text-lg font-bold text-gray-900 mb-2">{order.product.price}</p>
                <Link
                to={`/orders/${order.id}`}
                className="text-sm text-orange-600 hover:text-orange-800 font-semibold py-2 px-4 rounded-md border border-orange-600 hover:bg-orange-50 transition-colors duration-200"
                >
                Detayları Gör
                </Link>

              </div>
            </div>
          ))
        ) : (
          <p className="text-base text-gray-500 italic mt-6 p-4 bg-gray-50 rounded-md">
            Bu kategoriye ait sipariş bulunmamaktadır.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;