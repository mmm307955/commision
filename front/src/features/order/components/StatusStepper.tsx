import { Check, CreditCard, Palette, Eye, CheckCircle2 } from 'lucide-react';

export type OrderStatus = 'pending_payment' | 'in_progress' | 'review' | 'completed';

interface Step {
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    key: 'pending_payment',
    label: '입금 대기',
    description: '결제 확인 중',
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    key: 'in_progress',
    label: '작업 중',
    description: '창작자 작업 진행',
    icon: <Palette className="w-4 h-4" />,
  },
  {
    key: 'review',
    label: '검토 중',
    description: '최종 확인 단계',
    icon: <Eye className="w-4 h-4" />,
  },
  {
    key: 'completed',
    label: '완료',
    description: '작업물 전달 완료',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

const statusOrder: OrderStatus[] = ['pending_payment', 'in_progress', 'review', 'completed'];

interface StatusStepperProps {
  status: OrderStatus;
}

export function StatusStepper({ status }: StatusStepperProps) {
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden sm:flex items-center">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                  style={{
                    backgroundColor: isDone ? '#7C3AED' : isActive ? '#f3f0ff' : '#f9fafb',
                    borderColor: isDone || isActive ? '#7C3AED' : '#e5e7eb',
                    color: isDone ? '#ffffff' : isActive ? '#7C3AED' : '#9ca3af',
                  }}
                >
                  {isDone ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                {/* Label */}
                <div className="mt-2 text-center">
                  <div
                    className="text-xs whitespace-nowrap"
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      color: isDone || isActive ? '#7C3AED' : '#9ca3af',
                    }}
                  >
                    {step.label}
                  </div>
                  {isActive && (
                    <div className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{step.description}</div>
                  )}
                </div>
              </div>
              {/* Connector */}
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-6 mx-2"
                  style={{ backgroundColor: i < currentIndex ? '#7C3AED' : '#e5e7eb' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile stepper */}
      <div className="sm:hidden space-y-3">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={step.key} className="flex items-start gap-3">
              {/* Circle + line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0"
                  style={{
                    backgroundColor: isDone ? '#7C3AED' : isActive ? '#f3f0ff' : '#f9fafb',
                    borderColor: isDone || isActive ? '#7C3AED' : '#e5e7eb',
                    color: isDone ? '#ffffff' : isActive ? '#7C3AED' : '#9ca3af',
                  }}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-0.5 h-6 mt-1"
                    style={{ backgroundColor: i < currentIndex ? '#7C3AED' : '#e5e7eb' }}
                  />
                )}
              </div>
              {/* Label */}
              <div className="pt-1">
                <div
                  className="text-sm"
                  style={{
                    fontWeight: isActive ? 600 : 400,
                    color: isDone || isActive ? '#7C3AED' : '#9ca3af',
                  }}
                >
                  {step.label}
                </div>
                {isActive && (
                  <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
