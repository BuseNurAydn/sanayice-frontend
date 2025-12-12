import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../../../components/Timeline";
import ReviewModal from "../../../components/ReviewModal";
import SellerReviewModal from "../../../components/SellerReviewModal";
import { FaCheckCircle, FaBox, FaTimesCircle, FaUndo, FaRegClock } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE } from "../../../config";
import { rateSeller } from "../../../services/authService";
import { fetchCargoTrackingDetailed } from "../../../services/cargoService";


const STATUS_ICON = {
  "Teslim Edildi": <FaCheckCircle className="text-green-500 w-4 h-4" />,
  "Kargoya Verildi": <FaBox className="text-purple-500 w-4 h-4" />,
  "Onaylandı": <FaCheckCircle className="text-blue-500 w-4 h-4" />,
  "Beklemede": <FaRegClock className="text-yellow-600 w-4 h-4" />,
  "İptal Edildi": <FaTimesCircle className="text-red-500 w-4 h-4" />,
  "İade Edildi": <FaUndo className="text-purple-500 w-4 h-4" />,
};

const STATUS_COLOR = {
  "Teslim Edildi": "text-green-600",
  "Kargoya Verildi": "text-purple-600",
  "Onaylandı": "text-blue-600",
  "Beklemede": "text-yellow-600",
  "İptal Edildi": "text-red-600",
  "İade Edildi": "text-purple-600",
};

// Ürün Kartı
const OrderItemCard = ({ item, orderStatus, deliveredAt, openReviewModal, openSellerModal, navigate }) => (
  <div className="border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4 bg-white">

    {/* Timeline */}
    {orderStatus !== "Teslim Edildi" && <Timeline currentStatus={orderStatus} />}

    {/* Satıcı ve durum */}
    <div className="flex flex-col md:flex-row gap-6 md:items-center mb-4">
      <div className="flex gap-2 items-center">
        <p className="text-gray-700">Satıcı:</p>
        <span className="text-orange-600 text-lg">{item.sellerCompanyName || "Bilinmiyor"}</span>
      </div>
      <SellerReviewButton item={item} openSellerModal={openSellerModal} />
    </div>

    {/* Ürün Durum */}
    <div className="flex gap-2 items-center">
      {STATUS_ICON[orderStatus]}
      <span className={`text-sm font-semibold ${STATUS_COLOR[orderStatus]}`}>{orderStatus}</span>
    </div>
    {orderStatus === "Teslim Edildi" && (
      <span className="text-sm text-gray-600 font-semibold">
        {new Date(deliveredAt).toLocaleDateString()} tarihinde teslim edildi
      </span>
    )}

    {/* Kargo Takip */}
    {orderStatus === "Kargoya Verildi" && (
      <div className="flex justify-between items-center md:w-1/2 bg-gray-100 p-2 md:p-4 rounded">
        <p className="text-sm text-gray-700 font-semibold">
          Takip Numarası: {item.barkod || "Bilinmiyor"}
        </p>
        <button
          onClick={() => {
            if (item.barkod) {
              const pttUrl = `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${item.barkod}`;
              window.open(pttUrl, "_blank");
            } else {
              toast.error("Takip bilgisi mevcut değil!");
            }
          }}
          className="bg-orange-500 p-1 md:py-1 md:px-2 text-white text-sm rounded hover:bg-orange-600 cursor-pointer"
        >
          Kargom Nerede?
        </button>
      </div>
    )}

    {/* Ürün Bilgileri */}
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 border p-3 border-gray-200 rounded">
      <img
        src={item.imageUrls[0]}
        alt={item.productName}
        className="w-24 h-24 object-cover rounded mx-auto border border-gray-200"
      />
      <div className="flex-1 ml-2">
        <p className="font-medium">{item.productName}</p>
        <p className="text-xs text-gray-600">Marka: {item.productBrand} | Model: {item.productModel}</p>
        <p className="text-xs text-gray-600">
          Adet: {item.quantity} | Birim Fiyat: {item.unitPrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} TL
        </p>
        <p className="text-xs text-gray-600 font-semibold">
          Toplam: {item.totalPrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} TL
        </p>
      </div>

      <ProductReviewSection
        orderStatus={orderStatus}
        item={item}
        openReviewModal={openReviewModal}
        navigate={navigate}
      />
    </div>
  </div>
);

// Ürün Değerlendirme Butonu
const ProductReviewSection = ({ orderStatus, item, openReviewModal, navigate }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2">
    {orderStatus === "Teslim Edildi" && (
      <>
      <button
        onClick={() => openReviewModal(item)}
        className="text-xs md:text-sm font-semibold border border-orange-600 py-1 px-2 md:py-2 md:px-4 text-orange-600 cursor-pointer hover:bg-orange-100"
      >
        Ürünü Değerlendir
      </button>

      <button>İade Et</button>
      </>
    )}
    <button
      onClick={() => navigate("/sepetim")}
      className="text-xs md:text-sm font-semibold border py-1 px-2 md:py-2 md:px-4 text-white cursor-pointer bg-orange-500 rounded"
    >
      Tekrar Satın Al
    </button>
  </div>
);

// Satıcı Değerlendirme Butonu
const SellerReviewButton = ({ item, openSellerModal }) => (
  <button
    onClick={() => openSellerModal(item)}
    className="text-xs font-semibold border border-orange-600 py-0.5 px-1 text-orange-600 cursor-pointer hover:bg-orange-100 rounded"
  >
    Satıcıyı Değerlendir
  </button>
);

// Sipariş Özeti
const OrderSummary = ({ order, getStatusColor, renderTopInfo }) => (
  <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-neutral-100">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold">Sipariş No</span>
        <span className="text-sm text-gray-700 font-semibold">{order.orderNumber}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold">Sipariş Özeti</span>
        <span className="text-sm text-gray-700 font-semibold">{order.orderItems.length} ürün</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold">Sipariş Durumu</span>
        <span className={`text-sm font-semibold ${getStatusColor(order.statusDisplayName)}`}>{order.statusDisplayName}</span>
      </div>
      <div className="flex flex-col">{renderTopInfo()}</div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold">Toplam</span>
        <span className="text-sm text-gray-700 font-semibold">{order.totalAmount.toLocaleString({ style: "currency", currency: "TRY" })} TL</span>
      </div>
    </div>
  </div>
);


const OrderDetail = ({ order, sellerId }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerComment, setSellerComment] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const ORDER_API = `${API_BASE}/products/reviews`;

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setComment("");
  };

  const openSellerModal = (seller) => {
    setSelectedSeller(seller);
    setSellerRating(0);
    setSellerComment("");
    setIsSellerModalOpen(true);
  };

  const closeSellerModal = () => setIsSellerModalOpen(false);

  const submitSellerReview = async () => {
    if (!sellerRating || !sellerComment.trim()) {
      alert("Puan ve yorum gerekli!");
      return;
    }
    try {
      const result = await rateSeller({
        sellerId: selectedSeller.sellerId,
        rating: sellerRating,
        comment: sellerComment,
      });
      toast.success(result.message || "Satıcı başarıyla değerlendirildi!");
      closeSellerModal();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Satıcı değerlendirme gönderilirken bir hata oluştu.");
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct || rating <= 0 || !comment.trim()) {
      toast.error("Lütfen puan ve yorum girin!");
      return;
    }
    const reviewPayload = { productId: selectedProduct.productId, rating, comment };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(ORDER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewPayload),
      });
      if (!response.ok) throw new Error("Yorum eklenemedi");
      toast.success("Yorum başarıyla eklendi!");
      setSelectedProduct(null);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Yorum eklenirken bir hata oluştu.");
    }
  };

  const renderTopInfo = () => {
    if (order.statusDisplayName === "Teslim Edildi") {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-semibold">Teslim Tarihi</span>
          <span className="text-sm text-gray-700 font-semibold">
            {new Date(order.deliveredAt).toLocaleDateString()}
          </span>
        </div>
      );
    }

    if (order.statusDisplayName === "Kargoya Verildi") {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-semibold">Sipariş Tarihi</span>
          <span className="text-sm text-gray-700 font-semibold">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Sipariş Özeti */}
      <OrderSummary order={order} getStatusColor={(status) => STATUS_COLOR[status]} renderTopInfo={renderTopInfo} />

      {/* Ürün Kartları */}
      <div className="space-y-4">
        {order.orderItems.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            orderStatus={order.statusDisplayName}
            deliveredAt={order.deliveredAt}
            openReviewModal={openReviewModal}
            openSellerModal={openSellerModal}
            navigate={navigate}
          />
        ))}
      </div>

      {/* Satıcı Değerlendirme Modalı */}
      {isSellerModalOpen && selectedSeller && (
        <SellerReviewModal
          seller={selectedSeller}
          rating={sellerRating}
          setRating={setSellerRating}
          comment={sellerComment}
          setComment={setSellerComment}
          onClose={closeSellerModal}
          onSubmit={submitSellerReview}
        />
      )}

      {/* Ürün Değerlendirme Modalı */}
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

export default OrderDetail;

