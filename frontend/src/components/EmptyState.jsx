import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = ClipboardList,
  title = 'No tasks found',
  description = 'Get started by creating your first task to stay organized.',
  actionText = 'Create Task',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
