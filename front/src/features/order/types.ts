export interface Order {
    id: string;
    commissionId: string;
    commissionTitle: string;
    creatorNickname: string;
    thumbnail: string;
    totalPrice: number;
    orderDate: string;
    status: 'pending_payment' | 'in_progress' | 'review' | 'completed';
    selectedOptions: string[];
    requirements: string;
}
