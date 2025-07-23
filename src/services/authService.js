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

  const formData = new FormData();

  // JSON olan alanları topla
  const user = {
    name: profileData.name,
    lastname: profileData.lastname,
    phoneNumber: profileData.phoneNumber,
    billingAddress: profileData.billingAddress,
    shippingAddress: profileData.shippingAddress,
  };

  // JSON'u blob olarak ekle
  formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" })
  );

  // Fotoğraf varsa onu da ekle
  if (profileData.profileImage) {
    formData.append("profileImage", profileData.profileImage);
  }

  const response = await fetch(`${AUTH_API}/update-profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Profil güncellenemedi");
  }

  return response.json();
};


// API servislerinize eklenecek fonksiyonlar

// Şifre sıfırlama talebi
export const forgotPassword = async (resetData) => {
  try {
    const response = await fetch(`${AUTH_API}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Şifre sıfırlama talebi başarısız');
    }

    const data = await response.text(); // Backend string döndürüyor
    return data;
  } catch (error) {
    throw error;
  }
};

// Şifre sıfırlama kodu doğrulama
export const verifyResetCode = async (verificationData) => {
  try {
    const response = await fetch(`${AUTH_API}/verify-reset-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kod doğrulama başarısız');
    }

    const data = await response.text(); // Backend string döndürüyor
    return data;
  } catch (error) {
    throw error;
  }
};

// Şifre sıfırlama
export const resetPassword = async (resetData) => {
  try {
    const response = await fetch(`${AUTH_API}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Şifre sıfırlama başarısız');
    }

    const data = await response.text(); // Backend string döndürüyor
    return data;
  } catch (error) {
    throw error;
  }
};

