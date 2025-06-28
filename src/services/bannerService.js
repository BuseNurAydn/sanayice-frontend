const API_BASE = "/api/managers/banners";

//POST BANNER 
export const addBanner = async (banner) => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(banner),
  });

  if (!response.ok) {
    throw new Error("Banner eklenemedi.");
  }

  return response.json();
};

// PUT BANNER
export const updateBanner = async (id, banner) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(banner),
  });

  if (!response.ok) {
    throw new Error("Banner güncellenemedi.");
  }

  return response.json();
};

// GET BANNER
export const getBanners = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Bannerlar alınamadı.");
  }

  return response.json();
};

//PUT Aktif / pasif durum değiştir
export const toggleBannerStatus = async (bannerId) => {
  const token = localStorage.getItem("token"); 

  const response = await fetch(`${API_BASE}/${bannerId}/toggle-status`, {
    method: "PUT",
    headers: {
       Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Durum değiştirilemedi.");
  }

  return response.json();
};

// Banner sırasını değiştir
export const updateBannerOrder = async (bannerId, newOrder) => {
  const token = localStorage.getItem("token"); 
  const response = await fetch(`${API_BASE}/${bannerId}/order?order=${newOrder}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Banner sırası güncellenemedi: " + errorText);
  }

  return response.json();
};

//DELETE BANNER
export const deleteBanner = async (bannerId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${bannerId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Banner silinemedi: " + errorText);
  }
  return;
};

// PUBLİC BANNER
export const getAllPublicBanners = async () => {
  const response = await fetch("/api/banners/active");

  if (!response.ok) {
    throw new Error("Bannerlar alınamadı.");
  }

  return response.json();
};

