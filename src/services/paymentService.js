import { API_BASE } from "../config";

const API_URL = `${API_BASE}/payment`;

export const makePayment = async (paymentData) => {
  try {
    console.log("makePayment -> request body:", paymentData);

    const res = await fetch(`${API_URL}/charge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      // backend JSON dönmüyorsa raw text dönebilir; o yüzden fallback:
      data = { raw: text };
    }

    if (!res.ok) {
      // backend hata döndüyse burada fırlatıyoruz (caller try/catch ile yakalar)
      const err = data?.message || data || `HTTP ${res.status}`;
      throw new Error(err);
    }

    console.log("makePayment -> response:", data);
    return data;
  } catch (error) {
    // normalize error
    console.error("makePayment error:", error);
    throw error;
  }
};
