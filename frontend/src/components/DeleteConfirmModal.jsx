import React, { useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle, isLoading }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
                Delete Task
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-800">
                "{taskTitle || 'this task'}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-md shadow-rose-200 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
