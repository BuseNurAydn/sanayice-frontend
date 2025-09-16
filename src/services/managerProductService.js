import { API_BASE } from "../config";
const MANAGER_PRODUCTS_API = `${API_BASE}/manager/products`;

// ONAY BEKLEYEN ÜRÜNLER
export const getWaitingApprovalProducts = async () => {
  const token = localStorage.getItem("token"); 

  const response = await fetch(`${MANAGER_PRODUCTS_API}/waiting-approval` ,{
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Onay bekleyen ürünler alınamadı");
  }

  return response.json();
};

//ONAYLAMA
export const approveProduct = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${MANAGER_PRODUCTS_API}/${productId}/approve`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ürün onaylanamadı");
  }
  return response.json();
};

//REDDETME
export const rejectProduct = async (productId, rejectionReason) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${MANAGER_PRODUCTS_API}/${productId}/reject`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rejectionReason }),
  });

  if (!response.ok) {
    throw new Error("Ürün reddedilemedi");
  }
  return response.json();
};