import { API_BASE } from "../config";

const PRODUCTS_API = `${API_BASE}/products`;

const getToken = () => localStorage.getItem("token");

//LİSTELEME - GET
export const fetchMyProducts = async () => {
  const token = getToken();
 
  const response = await fetch(`${PRODUCTS_API}/my-products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ürünler alınamadı');
  }

  return await response.json();
}

//SİLME - DELETE
export const deleteProduct = async (productId) => {
  const token = getToken();

  const response = await fetch(`${PRODUCTS_API}/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ürün silinemedi');
  }

  return true; // Silme başarılıysa dönebilirsin
}

//ÜRÜN EKLEME - POST
export const createProduct = async (formData) => {
  const token = getToken();

  const response = await fetch(PRODUCTS_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type':'multipart/form-data; boundary=<calculated when request is sent>'
    },
    body: formData,
  });

  console.log(formData instanceof FormData)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Backend Hatası:", errorData);
    throw new Error(errorData.message || "Ürün eklenemedi.");
  }
};


//DÜZENLEME - PUT
export const updateProduct = async (id, updatedProduct) => {
  const token = getToken();

  const response = await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedProduct),
  });

  if (!response.ok) {
    throw new Error("Ürün güncelleme başarısız!");
  }

  return response.json();
};



