import React from 'react';
import { AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

const priorityConfig = {
  High: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertCircle,
  },
  Medium: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: ArrowUp,
  },
  Low: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: ArrowDown,
  },
};

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const config = priorityConfig[priority] || priorityConfig.Medium;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md border ${config.bg} ${sizeClasses}`}
    >
      <Icon className="w-3 h-3 stroke-[2.5]" />
      {priority}
    </span>
  );
};

export default PriorityBadge;
