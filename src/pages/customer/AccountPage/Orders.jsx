import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../../services/ordersService";
import { FaCheckCircle, FaBox, FaTimesCircle, FaUndo, FaRegClock } from "react-icons/fa";

// Status utils
const statusColor = {
  "Teslim Edildi": "text-green-600",
  "Kargoya Verildi": "text-purple-600",
  "Beklemede": "text-yellow-600",  
  "Onaylandı": "text-blue-600",
  "İptal Edildi": "text-red-600",
  "İade Edildi": "text-purple-600",
};

const statusIcon = {
  "Teslim Edildi": <FaCheckCircle className="text-green-500 w-4 h-4" />,
  "Kargoya Verildi": <FaBox className="text-purple-500 w-4 h-4" />,
  "Beklemede": <FaRegClock className="text-yellow-600 w-4 h-4" />,
  "Onaylandı": <FaCheckCircle className="text-blue-500 w-4 h-4" />,
  "İptal Edildi": <FaTimesCircle className="text-red-500 w-4 h-4" />,
  "İade Edildi": <FaUndo className="text-purple-500 w-4 h-4" />,
};

// Sipariş Ürünü Bileşeni
const OrderItem = ({ item, statusDisplayName }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 border border-gray-100 p-3 md:p-4 rounded-md">

    {/* Durum Bilgisi (Mobilde Üstte, Masaüstünde Solda) */}
    <div className="flex items-center gap-2 w-full md:w-1/4 pb-2 md:pb-0">
      {statusIcon[statusDisplayName]}
      <span className={`font-semibold text-sm ${statusColor[statusDisplayName]}`}>
        {statusDisplayName}
      </span>
    </div>

    {/* Ürün Detayları (Mobilde Altında, Masaüstünde Ortada) */}
    <div className="flex items-start gap-3 md:gap-4 w-full md:w-1/2">
      <img
        src={item.imageUrls[0]}
        alt={item.productName}
        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border border-gray-200 flex-shrink-0"
      />
      <div className="flex-1 min-w-0"> {/* Metin taşmasını engellemek için */}
        <p className="font-medium text-sm truncate">{item.productName}</p>
        <p className="text-xs text-gray-600">{item.productBrand}</p>
        <p className="text-xs text-gray-600">
          Adet: {item.quantity} | Birim Fiyat:{" "}
          {item.unitPrice.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          })}
        </p>
        <p className="text-sm text-gray-800 font-semibold mt-1">
          Toplam: {item.totalPrice.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          })}
        </p>
      </div>
    </div>

    <div className="hidden md:block md:w-1/4"></div>
  </div>
);

// Sipariş Kartı Bileşeni
const OrderCard = ({ order, navigate }) => (
  <div className="border border-gray-200 rounded-lg shadow-sm">
    <div className="bg-neutral-100 p-4 grid grid-cols-2 md:grid-cols-5 gap-4 rounded-t-lg">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Sipariş Tarihi:</span>
        <span className="text-sm text-gray-700 font-semibold">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Sipariş Özeti:</span>
        <span className="text-sm text-gray-700 font-semibold">
          {order.orderItems.length} ürün
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Alıcı:</span>
        <span className="text-sm text-gray-700 font-semibold">{order.customerName}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Toplam:</span>
        <span className="text-sm text-gray-700 font-semibold">
          {order.totalAmount.toLocaleString({ style: "currency", currency: "TRY" })} TL
        </span>
      </div>

      <button
        onClick={() => navigate(`/hesabim/siparislerim/${order.id}`, { state: { order } })}
        className="text-sm font-semibold border border-orange-600 py-1 px-6 text-orange-600 hover:bg-orange-100 rounded mt-4 md:mt-0 col-span-full md:col-auto justify-self-start md:justify-self-end cursor-pointer"
      >
        Detaylar
      </button>
    </div>

    {/* Ürünler */}
    <div className="p-4 space-y-3">
      {order.orderItems.map((item) => (
        <OrderItem key={item.id} item={item} statusDisplayName={order.statusDisplayName} />
      ))}
    </div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const tabs = [
    { key: "all", label: "Tüm Siparişler" },
    { key: "pending", label: "Beklemede" },
    { key: "shipped", label: "Kargoya Verildi" },
    { key: "delivered", label: "Teslim Edildi" },
    { key: "cancelled", label: "İptal Edildi" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Siparişler alınamadı", error);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="bg-white min-h-screen p-6 rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h2>

      {/* Sekmeler */}
      <div className="flex flex-wrap gap-4 md:gap-8 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${activeTab === tab.key
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-orange-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Siparişler */}
      <div className="space-y-6">
        {filteredOrders.length === 0 && (
          <p className="text-sm text-gray-500 italic mt-4">
            Bu kategoriye ait sipariş bulunmamaktadır.
          </p>
        )}

        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};
export default Orders;
