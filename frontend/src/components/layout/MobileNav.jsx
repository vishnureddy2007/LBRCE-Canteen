import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Clock, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);
  const itemCount = useCartStore((s) => s.items.reduce((sum, it) => sum + it.quantity, 0));

  if (!user || user.role !== 'STUDENT') return null;

  const links = [
    { to: '/student', icon: LayoutDashboard, label: 'Home', end: true },
    { to: '/student/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/student/cart', icon: ShoppingBag, label: 'Cart', badge: itemCount },
    { to: '/student/orders', icon: Clock, label: 'Orders' },
    { to: '/student/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 shadow-lg px-2 py-1.5 transition-all duration-300">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-brand-orange font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {link.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-brand-orange text-white font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-sm animate-bounce">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-brand-orange rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
