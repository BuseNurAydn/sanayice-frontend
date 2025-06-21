
const API_BASE = "/api/addresses"

//POST ADDRESS
export const createAddress = async (addressData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Adres oluşturulamadı");
  }

  return await response.json();
};

//GET ADDRESS
export const fetchAddresses = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_BASE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Token gerekiyor
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Adresler getirilemedi");
  }

  return await response.json();
};

//DELETE ADDRESS
export const deleteAddress = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Adres silinemedi");
  }

  return true;
};

//GET ID
export const getAddressById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Adres getirilemedi");
  }

  return await response.json();
};

//PUT ADDRESS
export const updateAddress = async (id, formData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Adres güncellenemedi");
  }
  return true;
};



