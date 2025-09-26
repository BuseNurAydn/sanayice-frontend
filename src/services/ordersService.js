import { API_BASE } from "../config";

const ORDERS_API = `${API_BASE}/orders`;

//Sepeti Onayla - Post
export const handleConfirmCart = async ({ shippingAddress, billingAddress, customerNotes }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${ORDERS_API}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress,
        billingAddress,
        customerNotes,
      }),
    });

    if (!response.ok) {
      throw new Error("Sepet onaylanamadı");
    }

    const result = await response.json();
    return result; 
  } catch (err) {
    console.error("Hata:", err.message);
    throw err;
  }
};

// Siparişleri Getir - GET
export const getOrders = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(ORDERS_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Siparişler alınamadı");
    }

    return await response.json();
  } catch (error) {
    console.error("Siparişler alınırken hata:", error.message);
    throw error;
  }
};
export const getStatus = async (status) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${ORDERS_API}/summary/status/${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Siparişler alınırken hata:", error.message);
    throw error;
  }
};
