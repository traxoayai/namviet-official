"use client";

import React, { useState, useEffect } from 'react';
import HeaderBar from '@/components/layout/HeaderBar';
import MenuBar from '@/components/layout/MenuBar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Xác định activePage dựa trên URL
  let initialActive = 'dashboard';
  if (pathname.includes('/warehouses')) initialActive = 'warehouses';
  if (pathname.includes('/products')) initialActive = 'products';
  if (pathname.includes('/users')) initialActive = 'users';

  const [activePage, setActivePage] = useState(initialActive);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Dummy states cho HeaderBar (có thể chuyển vào global state sau)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen font-sans flex overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-[#eef2f6] text-slate-900'}`}>
      
      <MenuBar 
        activePage={activePage} 
        setActivePage={(page) => {
          // Bỏ qua nếu chuyển hướng tĩnh vì đã dùng App Router
          setActivePage(page);
        }} 
        isDesktopCollapsed={isDesktopCollapsed} 
        setIsDesktopCollapsed={setIsDesktopCollapsed} 
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen ${isDesktopCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        
        <HeaderBar 
          activePage={activePage}
          setActivePage={setActivePage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />

        {/* Khu vực nội dung chính của App Router */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full bg-[#eef2f6] dark:bg-slate-950">
          {children}
        </main>
        
      </div>
    </div>
  );
}
