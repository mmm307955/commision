import { api } from '@/lib/api';

export interface CommissionOption {
    id: number;
    optionName: string;
    additionalPrice: number;
}

export interface CommissionData {
    id: number;
    title: string;
    description: string;
    basePrice: number;
    thumbnailUrl: string | null;
    status: string;
    artistId: number;
    artistNickname: string;
    artistProfileImageUrl: string | null;
    options: CommissionOption[];
    createdAt: string;
    updatedAt: string;
}

export async function fetchCommissions(): Promise<CommissionData[]> {
    const res = await api.get<CommissionData[]>('/api/commissions');
    return res.data;
}

export async function fetchCommission(id: number): Promise<CommissionData> {
    const res = await api.get<CommissionData>(`/api/commissions/${id}`);
    return res.data;
}

export async function createCommission(data: {
    title: string;
    description: string;
    basePrice: number;
    thumbnailUrl?: string;
    options: { optionName: string; additionalPrice: number }[];
}): Promise<CommissionData> {
    const res = await api.post<CommissionData>('/api/commissions', data);
    return res.data;
}

export async function deleteCommission(id: number): Promise<void> {
    await api.delete(`/api/commissions/${id}`);
}
