import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'Completed';

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="group relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges and Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <div className="relative group/status">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task, e.target.value)}
                aria-label="Change status"
                className="text-xs font-semibold py-0.5 pl-2 pr-6 rounded-full border cursor-pointer appearance-none transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                style={{
                  borderColor:
                    task.status === 'Completed'
                      ? '#a7f3d0'
                      : task.status === 'In Progress'
                      ? '#bfdbfe'
                      : '#fde68a',
                  color:
                    task.status === 'Completed'
                      ? '#047857'
                      : task.status === 'In Progress'
                      ? '#1d4ed8'
                      : '#b45309',
                  backgroundColor:
                    task.status === 'Completed'
                      ? '#ecfdf5'
                      : task.status === 'In Progress'
                      ? '#eff6ff'
                      : '#fffbeb',
                }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4
          className={`text-base font-bold mb-1.5 transition-colors line-clamp-2 ${
            task.status === 'Completed'
              ? 'line-through text-slate-400'
              : 'text-slate-800'
          }`}
        >
          {task.title}
        </h4>

        {/* Description */}
        {task.description ? (
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
            {task.description}
          </p>
        ) : (
          <div className="mb-4" />
        )}
      </div>

      {/* Footer Info: Due Date & Created Date */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar
            className={`w-3.5 h-3.5 ${
              isOverdue ? 'text-rose-500 stroke-[2.5]' : 'text-slate-400'
            }`}
          />
          {formattedDueDate ? (
            <span
              className={`font-medium ${
                isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'
              }`}
            >
              {formattedDueDate}
              {isOverdue && ' (Overdue)'}
            </span>
          ) : (
            <span className="text-slate-400">No due date</span>
          )}
        </div>

        {task.status === 'Completed' && (
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
