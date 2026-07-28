import React from 'react';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 pb-20 md:pb-6 pt-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <Logo className="scale-90" showText={true} />
        </div>

        <div className="text-center md:text-right space-y-1">
          <p>© {new Date().getFullYear()} Lakireddy Bali Reddy College of Engineering (LBRCE). All rights reserved.</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Digital Canteen Management System — Fast Campus Food Ordering & Digital Pickup.
          </p>
        </div>
      </div>
    </footer>
  );
}