
//Sepeti Onayla - Post
const API_BASE = '/api/orders'

export const handleConfirmCart = async ({ shippingAddress, billingAddress, customerNotes }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE}/confirm`, {
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
    const response = await fetch(API_BASE, {
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
