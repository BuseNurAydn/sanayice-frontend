import { API_BASE } from "../config";

const PRODUCTS_API = `${API_BASE}/products`;

const getToken = () => localStorage.getItem("token");

// LİSTELEME - GET
export const fetchMyProducts = async () => {
  const token = getToken();

  const response = await fetch(`${PRODUCTS_API}/my-products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ürünler alınamadı");
  }

  return await response.json();
};

// SİLME - DELETE
export const deleteProduct = async (productId) => {
  const token = getToken();

  const response = await fetch(`${PRODUCTS_API}/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ürün silinemedi");
  }

  return true;
};

// ÜRÜN EKLEME - POST (multipart/form-data uyumlu)
export const createProduct = async (formData) => {
  const token = localStorage.getItem("token");

  // FormData mı gerçekten?
  if (!(formData instanceof FormData)) {
    throw new Error("Hatalı form verisi! FormData bekleniyor.");
  }
 
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ürün eklenemedi.");
  }

  return await response.json();
};

// ÜRÜN GÜNCELLEME - PUT (multipart/form-data formatına uygun)
export const updateProduct = async (id, formData) => {
  const token = getToken();

  const response = await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,  
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Güncelleme hatası:", errorData);
    throw new Error(errorData.message || "Ürün güncellenemedi.");
  }

  return await response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${PRODUCTS_API}/my-products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Ürün alınamadı');
  return await response.json();
};
