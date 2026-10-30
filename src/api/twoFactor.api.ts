import { request } from './client';

export interface TwoFactorStatus {
  enabled: boolean;
  backupCodesCount: number;
}

export interface TwoFactorSetupData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export async function get2FAStatusApi(): Promise<TwoFactorStatus> {
  const res = await request<{ data: TwoFactorStatus }>('/2fa/status');
  return res.data;
}

export async function enable2FAApi(): Promise<TwoFactorSetupData> {
  const res = await request<{ data: TwoFactorSetupData }>('/2fa/enable', { method: 'POST' });
  return res.data;
}

export async function verifySetup2FAApi(token: string): Promise<boolean> {
  const res = await request<{ data: { verified: boolean } }>('/2fa/verify-setup', {
    method: 'POST',
    body: { token },
  });
  return res.data?.verified ?? false;
}

export async function disable2FAApi(token: string): Promise<void> {
  await request('/2fa/disable', { method: 'POST', body: { token } });
}

export async function regenerateBackupCodesApi(token: string): Promise<string[]> {
  const res = await request<{ data: { backupCodes: string[] } }>('/2fa/regenerate-backup-codes', {
    method: 'POST',
    body: { token },
  });
  return res.data?.backupCodes ?? [];
}
