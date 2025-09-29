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
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error("Ürün silinemedi");
    error.status = response.status;
    throw error;
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

export const getProductsBySeller = async (sellerId) => {
  const response = await fetch(`${PRODUCTS_API}/seller/${sellerId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Satıcı ürünleri alınamadı");
  return await response.json();
};


export const submitForApprovalProduct = async (id) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${PRODUCTS_API}/${id}/submit-for-approval`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Onaya gönderme hatası');
  }

  return response.json();
};

// ONAYLI ÜRÜNLERİ LİSTELE - GET
export const fetchMyApprovedProducts = async () => {
  const token = getToken();

  const response = await fetch(`${PRODUCTS_API}/my-products/approved`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Onaylı ürünler alınamadı");
  }

  return await response.json();
};

export const toggleProductStatus = async (id) => {
  const token = getToken();
  const response = await fetch(`${PRODUCTS_API}/${id}/toggle-status`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return await response.json();
};

// Satıcıya ait ürün soruları
export const getMyProductQuestions = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/product-questions/my-product-questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Sorular alınamadı");
  }

  return await response.json();
};

//soruyu cevaplamak
export const answerProductQuestion = async (questionId, answerText) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE}/product-questions/${questionId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answerText }),
    });

    if (!response.ok) {
      throw new Error('Cevap gönderilemedi');
    }

    return await response.json(); // backend cevabı
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//Reddetme
export const rejectProductQuestion = async (questionId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE}/product-questions/${questionId}/reject`, {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Soru reddedilemedi');
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Excel dosyası ürün import etme
export const bulkImportProducts = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PRODUCTS_API}/bulk-import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Toplu ürün yükleme başarısız");
  }

  return await response.json();
};


//  Zorunlu kolon başlıklarını çekme
export const getBulkImportRequiredColumns = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PRODUCTS_API}/bulk-import/required-columns`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Zorunlu kolon başlıkları alınamadı");
  }

  return await response.json();
};

//  Opsiyonel kolon başlıklarını çekme
export const getBulkImportOptionalColumns = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PRODUCTS_API}/bulk-import/optional-columns`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Opsiyonel kolon başlıkları alınamadı");
  }

  return await response.json();
};
