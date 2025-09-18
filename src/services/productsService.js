import { API_BASE } from "../config";

const PRODUCTS_API = `${API_BASE}/products`;

//ANASAYFA İÇİN ÜRÜNLER
export const getProducts = async () => {
 
  const response = await fetch(PRODUCTS_API, {
  });

  if (!response.ok) {
    throw new Error("Veri alınamadı");
  }

  return response.json();
};
//detail

//Kategoriye ait ürünler için
export const getProductsByCategoryId = async (categoryId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PRODUCTS_API}/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Ürünler alınamadı");

  return await response.json();
};

//Alt Kategoriye ait ürünler için
export const getProductsBySubCategoryId = async (subId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PRODUCTS_API}/subcategories/${subId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Ürünler alınamadı");

  return await response.json();
};

// SATICIYA AİT AKTİF ÜRÜNLER
export const getActiveProductsBySeller = async (sellerId) => {
  const response = await fetch(`${PRODUCTS_API}/seller/${sellerId}/store/active`);
  
  if (!response.ok) throw new Error("Satıcının ürünleri alınamadı");

  return response.json();
};

 //ÜRÜNE SORU SORMA
export const askProductQuestion = async (productId, questionText) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/product-questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      questionText,
    }),
  });

  if (!response.ok) throw new Error("Soru gönderilemedi");

  return response.json();
};

//Ürünün altına soruları getirme
export const getProductQuestions = async (productId) => {
  try {
    const response = await fetch(`${API_BASE}/product-questions/product/${productId}`);
    if (!response.ok) {
      throw new Error("Sorular alınamadı");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

//Soru adedi için
export const getProductQuestionsCount = async (productId) => {
  const res = await fetch(`${API_BASE}/product-questions/product/${productId}/count`);
  if (!res.ok) throw new Error("Count alınamadı");
  const data = await res.json();
  return data; 
};
