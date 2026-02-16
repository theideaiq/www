import { Badge } from '@repo/ui';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}

export function SubscriptionCard({
  plan,
  isSelected,
  onSelect,
}: SubscriptionCardProps) {
  // biome-ignore lint/a11y/useKeyWithClickEvents: Interactive card pattern
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
        ${
          isSelected
            ? 'border-brand-yellow bg-brand-yellow/5 scale-[1.02]'
            : 'border-slate-200 hover:border-brand-yellow/50 bg-white'
        }
      `}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant="brand"
            className="bg-brand-yellow text-brand-dark font-bold shadow-lg"
          >
            MOST POPULAR
          </Badge>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-6 w-6 rounded-full bg-brand-yellow flex items-center justify-center"
          >
            <Check size={14} className="text-brand-dark" strokeWidth={4} />
          </motion.div>
        )}
      </div>

      <div className="mb-6">
        <span className="text-3xl font-black text-slate-900">{plan.price}</span>
        <span className="text-slate-500 font-medium">/month</span>
      </div>

      <div className="space-y-3">
        {plan.features.map((feature, idx) => (
          <div key={`${plan.id}-feat-${idx}`} className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-sm text-slate-700 font-medium">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
