"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { MENU_DATA } from '@/config/menu.config';
import { useAuthStore } from '@/store/useAuthStore';

interface MenuBarProps {
  isDesktopCollapsed: boolean;
  setIsDesktopCollapsed: (val: boolean) => void;
}

export default function MenuBar({
  isDesktopCollapsed, setIsDesktopCollapsed
}: MenuBarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAuthStore();
  
  // Trạng thái lưu trữ các menu nào đang mở (accordion)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    if (isDesktopCollapsed) {
      setIsDesktopCollapsed(false); // Tự động mở sidebar nếu đang thu gọn
    }
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId) 
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: any) => {
    if (item.children) {
      toggleMenu(item.id);
    }
  };

  // Kiểm tra xem menu mẹ có chứa activePage ở trong sub-menu không
  const isMenuHasActiveChild = (children?: any[]) => {
    if (!children) return false;
    return children.some((child: any) => pathname.startsWith(child.href));
  };

  const isDirectlyActive = (href?: string) => {
    if (!href) return false;
    return pathname.startsWith(href);
  };

  // Filter MENU_DATA based on permissions
  const filteredMenuData = MENU_DATA.map(group => {
    const filteredItems = group.items.map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => hasPermission(child.href));
        return { ...item, children: filteredChildren };
      }
      return item;
    }).filter(item => {
      if (item.children) return item.children.length > 0;
      return hasPermission((item as any).href);
    });

    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  return (
    <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none ${isDesktopCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <Link href="/dashboard" className="h-14 flex items-center justify-between px-3 border-b border-slate-100 dark:border-slate-800 shrink-0 cursor-pointer">
        {!isDesktopCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden px-1">
            <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0 bg-white">
               <Image src="/Logo_Nam_Viet.png" alt="Nam Viet Logo" width={28} height={28} className="object-cover" />
            </div>
            <h1 className="text-[15px] font-black text-primary dark:text-primary-400 tracking-tight whitespace-nowrap">NAM VIỆT ERP</h1>
          </div>
        )}
        {isDesktopCollapsed && (
           <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm mx-auto bg-white">
              <Image src="/Logo_Nam_Viet.png" alt="Nam Viet Logo" width={28} height={28} className="object-cover" />
           </div>
        )}
      </Link>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        {filteredMenuData.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!isDesktopCollapsed && <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-5">{group.groupTitle}</h2>}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isExpanded = expandedMenus.includes(item.id || '');
                const hasActiveChild = isMenuHasActiveChild(item.children);
                const isDirectActive = isDirectlyActive((item as any).href);
                const isActive = isDirectActive || hasActiveChild;

                return (
                  <li key={item.id || item.name} className="relative">
                    {item.children ? (
                      <button 
                        onClick={() => handleMenuClick(item)}
                        className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-xl transition-all duration-200 active:scale-95 group ${isActive && !isExpanded ? 'bg-primary-50 dark:bg-primary-900/20 text-primary font-bold' : isDirectActive ? 'bg-primary text-white font-bold shadow-md shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'}`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={`${isDirectActive ? 'text-white' : isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} transition-colors`} strokeWidth={isActive ? 2.5 : 2} />
                          {!isDesktopCollapsed && <span className="text-[13px]">{item.name}</span>}
                        </div>

                        {!isDesktopCollapsed && (
                          <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                        )}

                        {/* Tooltip khi collapsed */}
                        {isDesktopCollapsed && (
                          <div className="absolute left-14 top-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-xs font-medium px-2 py-1.5 rounded-md whitespace-nowrap z-50 shadow-xl border border-slate-700">
                            {item.name}
                          </div>
                        )}
                      </button>
                    ) : (
                      <Link 
                        href={(item as any).href || '#'}
                        className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-xl transition-all duration-200 active:scale-95 group ${isDirectActive ? 'bg-primary text-white font-bold shadow-md shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'}`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={`${isDirectActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} transition-colors`} strokeWidth={isDirectActive ? 2.5 : 2} />
                          {!isDesktopCollapsed && <span className="text-[13px]">{item.name}</span>}
                        </div>

                        {/* Tooltip khi collapsed */}
                        {isDesktopCollapsed && (
                          <div className="absolute left-14 top-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-xs font-medium px-2 py-1.5 rounded-md whitespace-nowrap z-50 shadow-xl border border-slate-700">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    )}

                    {/* Sub-menu (Accordion) */}
                    {!isDesktopCollapsed && item.children && isExpanded && (
                      <ul className="mt-1 mb-2 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700 animate-in slide-in-from-top-2 duration-200">
                        {item.children.map(child => {
                          const isChildActive = isDirectlyActive(child.href);
                          return (
                            <li key={child.href} className="relative">
                              {/* Connector line */}
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-3 h-px bg-slate-200 dark:bg-slate-700"></div>
                              <Link
                                href={child.href}
                                className={`block w-full text-left pl-10 pr-3 py-2 rounded-xl text-[13px] transition-colors ${isChildActive ? 'text-primary font-bold bg-primary-50/50 dark:bg-primary-900/10' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Toggle Collapse Button */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="w-full flex items-center justify-center py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm active:scale-95"
        >
          {isDesktopCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
