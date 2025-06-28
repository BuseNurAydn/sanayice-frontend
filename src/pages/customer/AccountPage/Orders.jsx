import { useState, useEffect } from "react";
import { getOrders } from "../../../services/ordersService"; // siparişleri getiren fonksiyon
import ReviewModal from "../../../components/ReviewModal";
import { toast } from "react-toastify";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


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
  console.log(orders)

  // Duruma göre filtrele
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) =>
        order.status.toLowerCase() === activeTab.toLowerCase()
      );

  const getStatusColor = (status) => {
    switch (status) {
      case "Teslim Edildi":
        return "text-green-600";
      case "Kargoya Verildi":
        return "text-purple-300";
      case "Sipariş Onaylandı":
        return "text-blue-600";
      case "İptal Edildi":
        return "text-red-600";
      case "İade Edildi":
        return "text-purple-600";
      default:
        return "text-yellow-400";
    }
  };


  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setComment("");
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/products/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: selectedProduct.productId,
          rating,
          comment,
        }),
      });

      if (!response.ok) throw new Error("Yorum eklenemedi");

      toast("Yorum başarıyla eklendi!");
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);
      toast("Yorum eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 rounded-lg shadow-md"> {/* Ana konteyner için gölge ve padding */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h2> {/* Başlık eklendi */}

      {/* Sekmeler */}
      <div className="flex flex-wrap gap-4 md:gap-8 border-b border-gray-200 pb-4 mb-6"> {/* Daha fazla boşluk, responsive düzen */}
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-semibold transition-colors duration-200 ${activeTab === tab.key
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500 hover:text-orange-600"
              }`}
          >
            {tab.icon}
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
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-700 font-semibold">
                Sipariş No: {order.orderNumber}
              </p>
              <p className="text-xs text-gray-500">
                Sipariş Tarihi: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs">
                Durum:{" "}
                <span className={`font-semibold ${getStatusColor(order.statusDisplayName)}`}>
                  {order.statusDisplayName}
                </span>
              </p>

              <p className="text-xs text-gray-500">
                Toplam Tutar: {order.totalAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
              <p className="text-xs text-gray-500">Teslimat Adresi: {order.shippingAddress}</p>
              <p className="text-xs text-gray-500">Fatura Adresi: {order.billingAddress}</p>
              {order.customerNotes && (
                <p className="text-xs text-gray-500">Notlar: {order.customerNotes}</p>
              )}
            </div>

            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border border-gray-100 p-4 rounded-md"
                >
                  {/* Ürün görseli + bilgiler */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.additionalImages?.[0] || "https://via.placeholder.com/80"}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-600">
                        Marka: {item.productBrand} | Model: {item.productModel}
                      </p>
                      <p className="text-xs text-gray-600">
                        Adet: {item.quantity} | Birim Fiyat:{" "}
                        {item.unitPrice.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold">
                        Toplam:{" "}
                        {item.totalPrice.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        Durum: {item.statusDisplayName || item.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-end gap-x-2">
                    <button className="text-sm border border-blue-600 py-2 px-4 text-blue-600 font-semibold">
                      Ürün Detay
                    </button>
                    {order.statusDisplayName === "Teslim Edildi" && (
                      <button
                        onClick={() => openReviewModal(item)}
                        className="text-sm font-semibold border border-orange-600 py-2 px-4 text-orange-600"
                      >
                        Ürünü Değerlendir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* MODAL */}
      {selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          onClose={() => setSelectedProduct(null)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default Orders;
