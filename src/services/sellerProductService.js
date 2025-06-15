const API_BASE = '/api/products';

const getToken = () => localStorage.getItem("token");

//LİSTELEME - GET
export const fetchMyProducts = async () => {
  const token = getToken();
 
  const response = await fetch(`${API_BASE}/my-products`, {
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

  const response = await fetch(`${API_BASE}/${productId}`, {
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
export const createProduct = async (productData) => {
  const token = getToken();

  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) throw new Error("Ürün eklenemedi.");
};

//DÜZENLEME - PUT
export const updateProduct = async (id, updatedProduct) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/${id}`, {
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



