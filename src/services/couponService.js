import { API_BASE } from "../config";

const COUPON_API = `${API_BASE}/sellers/coupons`;

// ADD COUPON
export const addCoupon = async (couponData) => {
  const response = await fetch(COUPON_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
     body: JSON.stringify({
        ...couponData,
        discountType: couponData.discountType.toUpperCase() // "percentage" → "PERCENTAGE"
      }),
  });

  if (!response.ok) {
    throw new Error("Kupon eklenirken hata oluştu");
  }

  return await response.json();
};

// GET COUPON
export const getCoupons = async () => {
  const response = await fetch(COUPON_API, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Kuponlar getirilirken hata oluştu');
  }

  return response.json();
};

//UPDATE COUPON
export const updateCoupon = async (id, couponData) => {
  const response = await fetch(`${COUPON_API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      ...couponData,
      discountType: couponData.discountType.toUpperCase(),     //  "FIXED_AMOUNT"
      targetType: couponData.targetType.toUpperCase()          //  "VIP_CUSTOMERS"
    })
  });

  if (!response.ok) {
    throw new Error("Kupon güncellenirken hata oluştu");
  }

  return await response.json();
};

// DELETE COUPON
export const deleteCoupon = async (id) => {
  const response = await fetch(`${COUPON_API}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  });

  if (!response.ok) {
    throw new Error("Kupon silinirken hata oluştu");
  }

  return true;
};


