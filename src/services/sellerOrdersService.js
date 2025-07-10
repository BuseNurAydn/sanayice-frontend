import { API_BASE } from "../config";

const ORDERS_API = `${API_BASE}/seller/orders`;

const getToken = () => localStorage.getItem("token");

export const fetchSellerOrders = async () => {
  const token = getToken();

  const response = await fetch(`${ORDERS_API}/summary`, {
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

// Action PUT
export const updateOrderStatus = async (orderId, action) => {
  const token = getToken();

  try {
    const response = await fetch(`${ORDERS_API}/order/${orderId}/${action}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Backend hatası
      console.error("API Hatası Detayı:", errorText);
      throw new Error("İşlem başarısız");
    }

    return await response.json();
  } catch (err) {
    console.error("Sipariş güncellenemedi:", err.message);
    throw err;
  }
};



