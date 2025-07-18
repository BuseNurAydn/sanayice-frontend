import { API_BASE } from "../config";

const BANNER_API = `${API_BASE}/managers/banners`;

//POST BANNER 
export const addBanner = async (banner) => {
  const token = localStorage.getItem("token");
  const response = await fetch(BANNER_API, {
    method: "POST",
    headers: {
       Authorization: `Bearer ${token}`,
    },
    body: banner,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Güncelleme hatası:", errorData);
    throw new Error(errorData.message || "Banner eklenemedi.");
  }

  return await response.json();
};

// PUT BANNER
export const updateBanner = async (id, banner) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BANNER_API}/${id}`, {
    method: "PUT",
    headers: {
       Authorization: `Bearer ${token}`,
    },
    body: banner,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Banner güncellenemedi.");
  }

  return await response.json();
};

// GET BANNER
export const getBanners = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(BANNER_API, {
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

  const response = await fetch(`${BANNER_API}/${bannerId}/toggle-status`, {
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
  const response = await fetch(`${BANNER_API}/${bannerId}/order?order=${newOrder}`, {
    method: "PUT",
    headers: {
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

  const response = await fetch(`${BANNER_API}/${bannerId}`, {
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
  const response = await fetch(`${API_BASE}/banners/active`);

  if (!response.ok) {
    throw new Error("Bannerlar alınamadı.");
  }

  return response.json();
};

