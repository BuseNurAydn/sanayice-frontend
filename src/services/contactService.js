// src/services/contactService.js
import { API_BASE } from "../config";

const CONTACT_API = `${API_BASE}/contact`;

export const sendContactEmail = async (contactData) => {
  try {
    const response = await fetch(`${CONTACT_API}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Mesaj gönderiminde bir hata oluştu');
    }

    const result = await response.text();
    return {
      success: true,
      message: result
    };

  } catch (error) {
    console.error('Contact service error:', error);
    return {
      success: false,
      message: error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    };
  }
};

export default {
  sendContactEmail
};