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


