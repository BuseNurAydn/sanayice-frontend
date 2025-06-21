//ANASAYFA İÇİN ÜRÜNLER
const API_BASE = "/api/products";

export const getProducts = async () => {
 
  const response = await fetch(API_BASE, {
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

  const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Ürünler alınamadı");

  return await response.json();
};


