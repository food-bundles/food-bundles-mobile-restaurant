import { request, saveToken, clearToken } from './client';

export interface LoginPayload {
  email?: string;
  phone?: string;
  tin?: string;
  password: string;
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  tin: string;
  role: string;
  location: string | null;
  verified: boolean;
}

export async function loginApi(payload: LoginPayload): Promise<{ token: string; data: MeResponse }> {
  const res = await request<{ token: string; data: MeResponse }>('/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  await saveToken(res.token);
  return res;
}

export async function getMeApi(): Promise<MeResponse> {
  const res = await request<{ data: MeResponse }>('/me');
  return res.data;
}

export async function forgotPasswordApi(phone: string): Promise<void> {
  await request('/forgot-password', { method: 'POST', body: { phone }, auth: false });
}

export async function resetPasswordApi(phone: string, otp: string, newPassword: string): Promise<void> {
  await request('/reset-password', { method: 'POST', body: { phone, otp, newPassword }, auth: false });
}

export async function logoutApi(): Promise<void> {
  await clearToken();
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  tin: string;
  password: string;
  role: 'RESTAURANT' | 'HOTEL';
}

export async function registerApi(payload: RegisterPayload): Promise<{ token: string; data: MeResponse }> {
  const res = await request<{ token: string; data: MeResponse }>('/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  await saveToken(res.token);
  return res;
}

export async function updateProfileApi(data: {
  name?: string;
  email?: string;
  phone?: string;
  tin?: string;
}): Promise<MeResponse> {
  const res = await request<{ data: MeResponse }>('/me', { method: 'PATCH', body: data });
  return res.data;
}
