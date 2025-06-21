const API_BASE = "/api/managers";

const getToken = () => localStorage.getItem("token");

//KATEGORİLERİ LİSTELEME
export const fetchCategories = async () => {
  const token = getToken();

  const response = await fetch("/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Kategoriler alınamadı");

  return response.json();
};

//ALT KATEGORİLERİ LİSTELEME
export const fetchSubcategories = async () => {
  const token = getToken();

  const response = await fetch("/api/subcategories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Alt kategoriler alınamadı");

  return response.json();
};

//Tıklanan kategori ve alt kategorilerini getirmek için
export const getCategoryById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`/api/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Kategori verisi alınamadı");

  return await response.json();
};


//KATEGORİ - ALT KATEGORİLERİ SİLME
export const deleteCategory = async (id, type = "category") => {
  const token = getToken();

  const endpoint =
    type === "subcategory"
      ? `${API_BASE}/subcategories/${id}`
      : `${API_BASE}/categories/${id}`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Silme işlemi başarısız");
};

//DÜZENLEME İŞLEMİ
export const updateCategory = async (id, data) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Güncelleme başarısız");
  }
};

export const saveSubcategory = async (id, data) => {
  const token = getToken();

  const url = id
    ? `${API_BASE}/subcategories/${id}`
    : `${API_BASE}/subcategories`;

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

//KATEGORİ EKLEME
export const addCategory = async (categoryData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) throw new Error('Kategori eklenemedi');
};