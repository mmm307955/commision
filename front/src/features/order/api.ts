import { api } from '@/lib/api';

export interface OrderOptionSnapshot {
    optionName: string;
    optionPrice: number;
}

export interface OrderData {
    id: number;
    commissionTitle: string;
    commissionThumbnailUrl: string | null;
    creatorNickname: string;
    totalPrice: number;
    requestDetail: string;
    status: string;
    selectedOptions: OrderOptionSnapshot[];
    createdAt: string;
}

export async function createOrder(data: {
    commissionId: number;
    requestDetail: string;
    selectedOptionIds: number[];
}): Promise<OrderData> {
    const res = await api.post<OrderData>('/api/orders', data);
    return res.data;
}

export async function fetchMyOrders(): Promise<OrderData[]> {
    const res = await api.get<OrderData[]>('/api/orders/my');
    return res.data;
}

export async function updateOrderStatus(orderId: number, status: string): Promise<OrderData> {
    const res = await api.patch<OrderData>(`/api/orders/${orderId}/status`, { status });
    return res.data;
}
