import { API_BASE } from "../config";

const CAMPAIGN_API = `${API_BASE}/sellers/campaigns`;

// ADD CAMPAİGN
 export const addCampaign = async (campaignData) => {
  try {
    const response = await fetch(CAMPAIGN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...campaignData,
        discountType: campaignData.discountType.toUpperCase() // "percentage" → "PERCENTAGE"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Kampanya eklenemedi");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Kampanya ekleme hatası:", error.message);
    throw error;
  }
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
export const updateCampaign = async (id, updatedData) => {
  const response = await fetch(`${CAMPAIGN_API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Kampanya güncellenemedi");
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


