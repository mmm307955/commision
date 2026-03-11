import { Link } from 'react-router';
import { Star, Clock } from 'lucide-react';
import type { Commission } from '@/features/commission/types';

interface CommissionCardProps {
  commission: Commission;
}

export function CommissionCard({ commission }: CommissionCardProps) {
  return (
    <Link to={`/commission/${commission.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={commission.thumbnail}
            alt={commission.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Status badge */}
          <div className="absolute top-2.5 left-2.5">
            {commission.available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                신청 가능
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                신청 마감
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {commission.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: '#f3f0ff', color: '#7C3AED' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-sm text-gray-800 line-clamp-2 mb-3 group-hover:text-purple-700 transition-colors" style={{ fontWeight: 500 }}>
            {commission.title}
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={commission.creatorAvatar}
              alt={commission.creatorNickname}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-gray-500">{commission.creatorNickname}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-gray-600">{commission.rating}</span>
              <span className="text-gray-400">({commission.reviewCount})</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {commission.deliveryDays}일
              </div>
              <div className="text-sm" style={{ color: '#7C3AED', fontWeight: 600 }}>
                ₩{commission.basePrice.toLocaleString()}~
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
