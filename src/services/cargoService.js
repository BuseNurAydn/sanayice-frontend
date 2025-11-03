
import { API_BASE } from "../config";

const CARGO_API = `${API_BASE}/ptt`;

const getToken = () => localStorage.getItem("token");

export const createShipmentLabel = async (orderData) => {
  try {
    const token = getToken();
    const response = await fetch(`${CARGO_API}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error("Barkod etiketi oluşturulamadı");

    const data = await response.json();

    // PTT API’nin dönme biçimine göre
    const barkodUrl = data?.dongu?.[0]?.barkodQuid;

    return barkodUrl || null;
  } catch (error) {
    console.error("PTT API Hatası:", error);
    throw error;
  }
};

// Temel takip sorgusu
export const fetchCargoTracking = async (barcode) => {
  const response = await fetch(`${CARGO_API}/tracking/${barcode}`);
  if (!response.ok) {
    throw new Error("Kargo takibi yapılamadı");
  }
  return await response.json();
};

// Detaylı takip sorgusu
export const fetchCargoTrackingDetailed = async (barcode) => {
  const response = await fetch(`${CARGO_API}/tracking-detailed/${barcode}`);
  if (!response.ok) {
    throw new Error("Kargo detaylı takibi yapılamadı");
  }
  return await response.json();
};

//orderId ye göre takip sorgulama
export const fetchCargoTrackingByOrderId = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CARGO_API}/tracking/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Kargo takibi yapılamadı");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Kargo Takip Hatası:", error);
    throw error;
  }
};
