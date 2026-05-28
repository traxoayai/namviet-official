"use client";

import React from 'react';
import { 
  Search, Bell, Mail, User as UserIcon, Moon, Sun, 
  ChevronRight, LogOut, Key, DollarSign, FileBadge, 
  MessageCircle, HelpCircle, MessageSquare
} from 'lucide-react';

interface HeaderBarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (val: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
}

export default function HeaderBar({
  activePage, setActivePage,
  isDarkMode, setIsDarkMode,
  isProfileOpen, setIsProfileOpen,
  isChatOpen, setIsChatOpen,
  isSearchOpen, setIsSearchOpen
}: HeaderBarProps) {
  
  // Ánh xạ ID activePage ra tiêu đề
  const getPageTitle = () => {
    switch(activePage) {
      case 'dashboard': return 'Dashboard';
      case 'forum': return 'Diễn đàn & Thông báo';
      case 'master_data': return 'Cấu hình Hệ thống';
      default: return 'Trang tính năng';
    }
  };

  return (
    <header className="hidden lg:flex sticky top-0 z-40 items-center justify-between h-14 px-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-none">
      <div className="flex items-center gap-4 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
          <span 
            className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
            onClick={() => setActivePage('dashboard')}
          >
            Trang chủ
          </span>
          <ChevronRight size={14} className="mx-1 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shadow-sm text-[13px]">
            {getPageTitle()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Global Search */}
        <div 
          className="hidden xl:flex relative max-w-sm w-full cursor-pointer group"
          onClick={() => setIsSearchOpen(true)}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
          </div>
          <div 
            className="flex items-center justify-between w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-full text-base md:text-[13px] text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-inner dark:shadow-slate-900/50"
          >
            <span>Tìm kiếm...</span>
            <kbd className="hidden sm:inline-block pointer-events-none bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Forum & Announcements Icon */}
        <div className="relative group flex items-center justify-center">
          <button 
            onClick={() => setActivePage('forum')}
            className={`p-1.5 rounded-full transition-colors active:scale-95 ${activePage === 'forum' ? 'text-primary bg-primary-50 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800'}`}
          >
            <MessageSquare size={18} className="transition-colors" />
          </button>
          {/* Tooltip */}
          <div className="absolute top-full mt-3 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 dark:border-slate-600">
              Diễn đàn & Thông báo nội bộ
              <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 border-l border-t border-slate-700 dark:border-slate-600"></div>
            </div>
          </div>
        </div>

        {/* Help/Guide Icon */}
        <div className="relative group flex items-center justify-center">
          <button 
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95"
          >
            <HelpCircle size={18} className="group-hover:text-primary transition-colors" />
          </button>
          {/* Tooltip */}
          <div className="absolute top-full mt-3 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 dark:border-slate-600">
              Hướng dẫn sử dụng Web/App
              <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 border-l border-t border-slate-700 dark:border-slate-600"></div>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95"
          title={isDarkMode ? "Chế độ Sáng" : "Chế độ Tối"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Chatbot Icon */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-full transition-colors group active:scale-95"
          title="Trợ lý AI"
        >
          <MessageCircle size={18} className="group-hover:text-primary dark:group-hover:text-primary-400 transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900 shadow-sm"></span>
        </button>

        {/* Mail Icon */}
        <button className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-full transition-colors group active:scale-95">
          <Mail size={18} className="group-hover:text-primary dark:group-hover:text-primary-400 transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-white dark:border-slate-900 shadow-sm"></span>
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-full transition-colors group active:scale-95">
          <Bell size={18} className="group-hover:text-primary dark:group-hover:text-primary-400 transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900 shadow-sm"></span>
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>

        {/* User Profile */}
        <div className="relative">
           <div 
             onClick={() => setIsProfileOpen(!isProfileOpen)}
             className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-2.5 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all active:scale-95"
           >
             <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0">
                <UserIcon size={16} />
             </div>
             <div className="flex flex-col">
               <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-tight">Admin</span>
               <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-tight">Quản trị viên</span>
             </div>
           </div>

           {/* Dropdown Menu */}
           {isProfileOpen && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
               <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                     <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <FileBadge size={16} className="text-blue-500" />
                        Thông tin Hồ sơ
                     </button>
                     <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <DollarSign size={16} className="text-emerald-500" />
                        Thông tin Thu nhập
                     </button>
                     <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <Key size={16} className="text-orange-500" />
                        Đổi Mật khẩu
                     </button>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                     <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                        <LogOut size={16} />
                        Đăng Xuất
                     </button>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>
    </header>
  );
}
