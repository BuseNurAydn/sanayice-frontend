import { API_BASE } from "../config";

const CAMPAIGN_API = `${API_BASE}/sellers/campaigns`;

// ADD CAMPAİGN
export const addCampaign = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(CAMPAIGN_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = new Error("Kampanya eklenemedi");
    error.status = response.status;
    throw error;
  }
  return await response.json();
};


// GET CAMPAİGN
export const getCampaigns = async () => {
  const response = await fetch(`${API_BASE}/managers/campaigns`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kampanyalar getirilemedi");
  }

  return await response.json();
};

// UPDATE CAMPAİGN
export const updateCampaign = async (id, formData) => {
  const response = await fetch(`${CAMPAIGN_API}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = new Error("Kampanya güncellenemedi.");
    error.status = response.status;
    throw error;
  }


  return await response.json();
};

// DELETE CAMPAİGN
export const deleteCampaign = async (id) => {
  const response = await fetch(`${CAMPAIGN_API}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kampanya silinirken hata oluştu");
  }

  return true;
};


