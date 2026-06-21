import { Injectable } from '@angular/core';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

let adminToken = '';

export function setAdminToken(token: string) {
  adminToken = token;
  localStorage.setItem('admin_token', token);
}

export function getAdminToken(): string {
  if (!adminToken) {
    adminToken = localStorage.getItem('admin_token') || '';
  }
  return adminToken;
}

function authHeaders() {
  return { Authorization: `Bearer ${getAdminToken()}` };
}

@Injectable({ providedIn: 'root' })
export class Api {

  async login(firebaseToken: string) {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { firebaseToken });
    return res.data;
  }

  async getUsers() {
    const res = await axios.get(`${BASE_URL}/api/users/all`, { headers: authHeaders() });
    return res.data;
  }

  async getAppointments() {
  const res = await axios.get(`${BASE_URL}/api/appointments/all`, { headers: authHeaders() });
  return res.data;
}

  async getPendingConsultants() {
    const res = await axios.get(`${BASE_URL}/api/consultants/pending`, { headers: authHeaders() });
    return res.data;
  }

  async getConsultantsByDiscipline(discipline: string) {
    const res = await axios.get(`${BASE_URL}/api/consultants?discipline=${discipline}`, { headers: authHeaders() });
    return res.data;
  }

  async approveConsultant(id: string) {
    const res = await axios.put(`${BASE_URL}/api/consultants/${id}/status`,
      { status: 'APPROVED' }, { headers: authHeaders() });
    return res.data;
  }

  async rejectConsultant(id: string) {
    const res = await axios.put(`${BASE_URL}/api/consultants/${id}/status`,
      { status: 'REJECTED' }, { headers: authHeaders() });
    return res.data;
  }
}