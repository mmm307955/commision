export interface CommissionOption {
  id: string;
  label: string;
  price: number;
}

export interface Commission {
  id: string;
  title: string;
  creatorNickname: string;
  creatorAvatar: string;
  basePrice: number;
  thumbnail: string;
  images: string[];
  description: string;
  tags: string[];
  options: CommissionOption[];
  available: boolean;
  rating: number;
  reviewCount: number;
  deliveryDays: number;
}
