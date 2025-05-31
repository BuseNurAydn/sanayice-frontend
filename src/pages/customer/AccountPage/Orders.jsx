import { useState } from "react";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "Tüm Siparişler" },
    { key: "ongoing", label: "Devam Edenler" },
    { key: "cancelled", label: "İptaller" },
    { key: "returned", label: "İadeler" },
  ];

  // Sahte sipariş verileri
  const fakeOrders = [
    {
      id: "123456",
      date: "2024-05-10",
      status: "Teslim Edildi",
      type: "all",
      product: {
        name: "Kadın Siyah Sneaker",
        image: "https://via.placeholder.com/80",
      },
    },
    {
      id: "789012",
      date: "2024-05-25",
      status: "Kargoya Verildi",
      type: "ongoing",
      product: {
        name: "Erkek Mavi T-Shirt",
        image: "https://via.placeholder.com/80",
      },
    },
    {
      id: "345678",
      date: "2024-04-15",
      status: "İptal Edildi",
      type: "cancelled",
      product: {
        name: "Bluetooth Kulaklık",
        image: "https://via.placeholder.com/80",
      },
    },
    {
      id: "987654",
      date: "2024-03-22",
      status: "İade Edildi",
      type: "returned",
      product: {
        name: "Laptop Çantası",
        image: "https://via.placeholder.com/80",
      },
    },
  ];

  // Aktif sekmeye göre
  const filteredOrders =
    activeTab === "all"
      ? fakeOrders
      : fakeOrders.filter((order) => order.type === activeTab);

  return (
    <div>
      {/* Sekmeler */}
      <div className="flex gap-12 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-semibold transition-colors duration-200 ${
              activeTab === tab.key
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-orange-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Siparişler */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white shadow-sm"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {order.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sipariş No: {order.id}
                  </p>
                  <p className="text-xs text-gray-500">Tarih: {order.date}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    {order.status}
                  </p>
                </div>
              </div>
              <button className="text-sm text-orange-600 hover:underline font-semibold">
                Detayları Gör
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic mt-4">
            Bu kategoriye ait sipariş bulunmamaktadır.
          </p>
        )}
      </div>
    </div>
  );
};
export default Orders;

