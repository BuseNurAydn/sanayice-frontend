//GET İSTATİSLİK
const API_BASE ='/api/seller/dashboard'

const getToken = () => localStorage.getItem("token");

export const fetchDashboardStats = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('İstatistikler alınamadı');
  }
  return await response.json();
};

//GET- SON 3 SİPARİŞ
export const fetchRecentOrders = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/recent-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Son siparişler alınamadı.");
  }
  return await response.json();
};

//GET- POPÜLER ÜRÜNLER
export const fetchPopulerProducts = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/popular-products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Popüler ürünler alınamadı.");
  }
  return await response.json();
};
