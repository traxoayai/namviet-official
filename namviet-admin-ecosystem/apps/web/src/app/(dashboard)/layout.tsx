"use client";

import React, { useState, useEffect } from 'react';
import HeaderBar from '@/components/layout/HeaderBar';
import MenuBar from '@/components/layout/MenuBar';
import ChatbotSheet from '@/components/overlays/ChatbotSheet';
import GlobalSearchModal from '@/components/overlays/GlobalSearchModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        isDesktopCollapsed={isDesktopCollapsed} 
        setIsDesktopCollapsed={setIsDesktopCollapsed} 
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen ${isDesktopCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        
        <HeaderBar 
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
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full bg-[#eef2f6] dark:bg-slate-950 p-4">
          {children}
        </main>
        
      </div>
      <ChatbotSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
