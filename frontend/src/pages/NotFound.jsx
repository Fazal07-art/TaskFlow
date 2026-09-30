import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
          Error 404
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            to="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-100 transition-all"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
