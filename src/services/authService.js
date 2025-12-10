import { API_BASE } from "../config";

const AUTH_API = `${API_BASE}/auth`;
const OTP_API = `${API_BASE}/otp`;

// Eski: verifyEmail (E-posta doğrulama)
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

    const data = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
};

//  email resendVerificationCode - 
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

    const data = await response.text();
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

    const data = await response.text();
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

    const data = await response.text();
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

    const data = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
};

export const isFollowingSeller = async (sellerId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${AUTH_API}/is-following/${sellerId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Takip durumu alınamadı");
  }

  return await res.json();
};

//GET FOLLOWİNG
export const getFollowing = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${AUTH_API}/following`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Takipçi bilgisi alınamadı");
  }

  return response.json();
};

// SELLER FOLLOW
export const followSeller = async (sellerId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${AUTH_API}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sellerId }),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(data.message || "Satıcıyı takip ederken hata oluştu");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// SELLER UNFOLLOW
export const unfollowSeller = async (sellerId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${AUTH_API}/unfollow/${sellerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(data.message || "Satıcıyı takipten çıkarken hata oluştu");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
// SELLER RATE
export const rateSeller = async ({ sellerId, rating, comment }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${AUTH_API}/rate-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sellerId,
        rating,
        comment,
      }),
    });

    const data = await response.text();

    if (!response.ok) {
      console.error("Rate Seller Error:", data);
      throw new Error(data || "Satıcıyı değerlendirirken hata oluştu");
    }

    return { message: data };
  } catch (error) {
    throw error;
  }
};

// Satıcıya ait yorumları çek
export const getSellerRatings = async (sellerId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${AUTH_API}/seller-ratings/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Yorumlar alınamadı");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};


// OTP Servis Fonksiyonları
// POST /api/otp/generate
export const generateOtp = async (payload) => {
  // Payload: { "gsm": "905301111111" }
  try {
    const response = await fetch(`${OTP_API}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(text);
      } catch { }
      throw new Error(errorData.message || text || 'OTP kodu gönderilemedi.');
    }

    return { message: text };
  } catch (error) {
    throw error;
  }
};

// POST /api/otp/confirm
export const confirmOtp = async (payload) => {
  // Payload: { "gsm":"905301111111", "otp":"765897" }
  try {
    const response = await fetch(`${OTP_API}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(text);
      } catch { }
      throw new Error(errorData.message || text || 'OTP doğrulama başarısız.');
    }

    return { message: text };
  } catch (error) {
    throw error;
  }
};

// POST (Opsiyonel)
export const getPhoneVerificationStatus = async (payload) => {
  // Payload: { "gsm":"905301111111" }
  try {
    const response = await fetch(`${OTP_API}/phoneVerificationStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Telefon doğrulama durumu alınamadı.');
    }

    // Backend'in boolean veya detaylı durum döndürdüğü varsayılır
    return data;
  } catch (error) {
    throw error;
  }
};
