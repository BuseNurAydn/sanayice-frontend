import { API_BASE } from "../config";

const CATEGORY_API = `${API_BASE}`;

const getToken = () => localStorage.getItem("token");

// KATEGORİLERİ LİSTELEME
export const fetchCategories = async () => {
  
  const response = await fetch(`${CATEGORY_API}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kategoriler alınamadı: ${response.status} ${errorText}`);
  }

  return response.json();
};

// ALT KATEGORİLERİ LİSTELEME
export const fetchSubcategories = async () => {
  const token = getToken();

  const response = await fetch(`${CATEGORY_API}/subcategories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Alt kategoriler alınamadı");

  return response.json();
};

// TIKLANAN KATEGORİYİ GETİR
export const getCategoryById = async (id) => {
  const token = getToken();

  const response = await fetch(`${CATEGORY_API}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Kategori verisi alınamadı");

  return await response.json();
};

// KATEGORİ / ALT KATEGORİ SİLME
export const deleteCategory = async (id, type = "category") => {
  const token = getToken();

  const endpoint =
    type === "subcategory"
      ? `${CATEGORY_API}/subcategories/${id}`
      : `${CATEGORY_API}/categories/${id}`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Silme işlemi başarısız");
};

// KATEGORİ GÜNCELLEME
export const updateCategory = async (id, formData) => {
  const token = getToken();

  const response = await fetch(`${CATEGORY_API}/managers/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

   if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Güncelleme hatası:", errorData);
    throw new Error(errorData.message || "Kategori güncellenemedi.");
  }

  return await response.json();
};


// ALT KATEGORİ EKLE / GÜNCELLE
export const saveSubcategory = async (id, data) => {
  const token = getToken();

  const url = id
    ? `${CATEGORY_API}/subcategories/${id}`
    : `${CATEGORY_API}/subcategories`;

  const method = id ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Alt kategori kaydedilemedi");
};

// KATEGORİ EKLEME
export const addCategory = async (formData) => {
  const token = getToken();

 // formData mı gerçekten?
  if (!(formData instanceof FormData)) {
    throw new Error("Hatalı form verisi! CategoryData bekleniyor.");
  }

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await fetch(`${CATEGORY_API}/managers/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Kategori eklenemedi.");
  }

  return await response.json();
};
