import { API_BASE } from "../config";

const SUPPORT_API = `${API_BASE}`;

//POST 
export const createSupportTicket = async (ticketData) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${SUPPORT_API}/support/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(ticketData)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Destek talebi hatası:", error);
    throw new Error(error?.detail || 'Destek talebi oluşturulamadı.');
  }

  return await response.json();
};

//GET
export const getSupportTicketsByCustomer = async (customerId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${SUPPORT_API}/support/tickets/customer/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Talepler alınamadı.');
  }

  return await response.json();
};

//MANAGER GET ALL TİCKETS
export const getAllSupportTickets = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${SUPPORT_API}/managers/support/tickets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Destek talepleri alınamadı.');
  }
  return await response.json();
};

//POST MESSAGE
export const replyToSupportTicket = async (ticketId, message) => {
  const token = localStorage.getItem('token'); 

  const response = await fetch(`${SUPPORT_API}/managers/support/tickets/${ticketId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error('Yanıt gönderilemedi.');
  }

  return await response.json();
};

//PUT STATUS
export const updateTicketStatus = async (ticketId, status) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${SUPPORT_API}/managers/support/tickets/${ticketId}/status?status=${status}`, {
    method: 'PUT',
    headers: {
       Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Durum güncellenemedi.");
  }

  return await response.json();
};


