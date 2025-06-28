const API_BASE = "/api/auth";

export const login = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const registerCustomer = async (payload) => {

  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Kayıt sırasında hata oluştu.');
  }

  return result;
};

export const registerSeller = async (payload) => {

    const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Kayıt sırasında hata oluştu.');
    }

    return result;
};

//GET PROFİLE
export const getMyProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Profil bilgisi alınamadı");
  }

  return response.json();
};

//SELLER-MANAGER PUT PROFİLE
export const updateMyProfile = async (profileData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Profil güncellenemedi");
  }

  return response.json();
};



