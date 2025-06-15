const API_BASE = "/api/seller/orders";

const getToken = () => localStorage.getItem("token");


export const fetchSellerOrders = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`, // token varsa
    },
  });

  if (!response.ok) {
    throw new Error("Siparişler alınamadı");
  }

  const data = await response.json();
  return data;
};

// Action PUT
export const updateOrderStatus = async (orderId, action) => {
  const token = getToken();

  try {
    const response = await fetch(`/api/seller/orders/order/${orderId}/${action}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Backend hatasını oku
      console.error("API Hatası Detayı:", errorText); // Konsola yazdır
      throw new Error("İşlem başarısız");
    }

    return await response.json();
  } catch (err) {
    console.error("Sipariş güncellenemedi:", err.message);
    throw err;
  }
};



