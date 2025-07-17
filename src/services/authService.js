import { API_BASE } from "../config";

const AUTH_API = `${API_BASE}/auth`;
export const verifyEmail = async (verificationData) => {
  try {
    const response = await fetch(`${AUTH_API}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Email doğrulama başarısız');
    }

    const data = await response.text(); // Backend string döndürüyor
    return data;
  } catch (error) {
    throw error;
  }
};

// Doğrulama kodu tekrar gönderme fonksiyonu
export const resendVerificationCode = async (resendData) => {
  try {
    const response = await fetch(`${AUTH_API}/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kod gönderme başarısız');
    }

    const data = await response.text(); // Backend string döndürüyor
    return data;
  } catch (error) {
    throw error;
  }
};




export const login = async (loginData) => {
  try {
    const response = await fetch(`${AUTH_API}/login`, {
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
  const response = await fetch(`${AUTH_API}/register`, {
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

    const response = await fetch(`${AUTH_API}/register`, {
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

  const response = await fetch(`${AUTH_API}/profile`, {
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

  const response = await fetch(`${AUTH_API}/update-profile`, {
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



