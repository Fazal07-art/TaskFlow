import React from 'react';

const colorVariants = {
  indigo: {
    bg: 'bg-indigo-50/70 text-indigo-600',
    border: 'hover:border-indigo-200',
    badge: 'bg-indigo-50 text-indigo-700',
    glow: 'group-hover:ring-indigo-100',
  },
  amber: {
    bg: 'bg-amber-50/70 text-amber-600',
    border: 'hover:border-amber-200',
    badge: 'bg-amber-50 text-amber-700',
    glow: 'group-hover:ring-amber-100',
  },
  blue: {
    bg: 'bg-blue-50/70 text-blue-600',
    border: 'hover:border-blue-200',
    badge: 'bg-blue-50 text-blue-700',
    glow: 'group-hover:ring-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50/70 text-emerald-600',
    border: 'hover:border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-700',
    glow: 'group-hover:ring-emerald-100',
  },
  rose: {
    bg: 'bg-rose-50/70 text-rose-600',
    border: 'hover:border-rose-200',
    badge: 'bg-rose-50 text-rose-700',
    glow: 'group-hover:ring-rose-100',
  },
};

const StatCard = ({ title, count, icon: Icon, color = 'indigo', subtitle, onClick }) => {
  const scheme = colorVariants[color] || colorVariants.indigo;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md ${scheme.border} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {count ?? 0}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${scheme.bg} group-hover:scale-110`}
        >
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
