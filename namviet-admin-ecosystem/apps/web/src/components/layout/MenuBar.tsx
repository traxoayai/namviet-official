"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ChevronRight, ChevronLeft, ChevronDown, Store, 
  Activity, PackageSearch, Boxes, Receipt, Headphones,
  Users, Megaphone, BarChart3, Settings
} from 'lucide-react';

interface MenuBarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isDesktopCollapsed: boolean;
  setIsDesktopCollapsed: (val: boolean) => void;
}

const MENU_DATA = [
  {
    groupTitle: 'TRẠM LÀM VIỆC',
    items: [
      {
        id: 'retail',
        name: 'Cửa hàng (Bán lẻ)',
        icon: Store,
        children: [
          { id: 'retail_create', name: 'Tạo đơn mới' },
          { id: 'retail_list', name: 'Danh sách Đơn hàng' },
          { id: 'retail_cskh', name: 'Chăm sóc khách hàng' },
        ]
      },
      {
        id: 'medical',
        name: 'Y Tế',
        icon: Activity,
        children: [
          { id: 'medical_reception', name: 'Lễ Tân' },
          { id: 'medical_clinic', name: 'Phòng Khám' },
          { id: 'medical_nursing', name: 'Điều Dưỡng và Thủ Thuật' },
          { id: 'medical_testing', name: 'CĐHA và Xét nghiệm' },
        ]
      },
      {
        id: 'b2b',
        name: 'Bán Sỉ (B2B)',
        icon: PackageSearch,
        children: [
          { id: 'b2b_create', name: 'Tạo đơn mới' },
          { id: 'b2b_list', name: 'Danh sách Đơn hàng' },
          { id: 'b2b_cskh', name: 'Chăm sóc khách hàng (B2B)' },
        ]
      },
      {
        id: 'inventory',
        name: 'Vận hành Kho',
        icon: Boxes,
        children: [
          { id: 'inv_import', name: 'Nhập hàng' },
          { id: 'inv_export', name: 'Xuất hàng' },
          { id: 'inv_transfer', name: 'Chuyển hàng (Kho)' },
          { id: 'inv_check', name: 'Kiểm kê' },
          { id: 'inv_gifts', name: 'Quản lý Quà tặng' },
          { id: 'inv_assets', name: 'Quản lý Vật tư (Tài sản)' },
          { id: 'inv_shipping', name: 'Giao vận (Theo dõi)' },
        ]
      },
      {
        id: 'accounting',
        name: 'Kế toán',
        icon: Receipt,
        children: [
          { id: 'acc_receipt', name: 'Phiếu Thu / Chi' },
          { id: 'acc_vat', name: 'Hóa đơn VAT' },
          { id: 'acc_report', name: 'Báo cáo tài chính nhanh' },
        ]
      },
      {
        id: 'support',
        name: 'Hỗ trợ & Tương tác',
        icon: Headphones,
        children: [
          { id: 'sup_bot', name: 'Tiếp nhận Chatbot' },
          { id: 'sup_fb', name: 'Kênh Facebook' },
          { id: 'sup_zalo', name: 'Kênh Zalo' },
          { id: 'sup_tiktok', name: 'Kênh TMĐT & TikTok' },
        ]
      }
    ]
  },
  {
    groupTitle: 'PHÒNG ĐIỀU HÀNH',
    items: [
      {
        id: 'hr',
        name: 'Nhân sự & Đào tạo',
        icon: Users,
        children: [
          { id: 'hr_profile', name: 'Hồ sơ Nhân sự' },
          { id: 'hr_contract', name: 'Hợp đồng & Bảo hiểm' },
          { id: 'hr_training', name: 'Khóa học & Bài thi' },
          { id: 'hr_kpi', name: 'Giao việc & KPI' },
        ]
      },
      {
        id: 'marketing',
        name: 'Marketing & PTKH',
        icon: Megaphone,
        children: [
          { id: 'mkt_segment', name: 'Nhóm khách hàng' },
          { id: 'mkt_voucher', name: 'Voucher & CTKM' },
          { id: 'mkt_sms', name: 'Tin nhắn hàng loạt' },
        ]
      },
      {
        id: 'reports',
        name: 'Báo cáo tổng hợp',
        icon: BarChart3,
        children: [
          { id: 'rep_business', name: 'Báo cáo Kinh doanh' },
          { id: 'rep_finance', name: 'Báo cáo Tài chính' },
          { id: 'rep_inventory', name: 'Báo cáo Kho' },
          { id: 'rep_marketing', name: 'Báo cáo Marketing' },
        ]
      },
      // Nút độc lập không có sub-menu
      {
        id: 'master_data',
        name: 'Cấu hình Hệ thống',
        icon: Settings,
      }
    ]
  }
];

export default function MenuBar({
  activePage, setActivePage,
  isDesktopCollapsed, setIsDesktopCollapsed
}: MenuBarProps) {
  
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
    } else {
      setActivePage(item.id);
    }
  };

  // Kiểm tra xem menu mẹ có chứa activePage ở trong sub-menu không
  const isMenuHasActiveChild = (children?: any[]) => {
    if (!children) return false;
    return children.some((child: any) => child.id === activePage);
  };

  return (
    <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none ${isDesktopCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-100 dark:border-slate-800 shrink-0 cursor-pointer" onClick={() => setActivePage('dashboard')}>
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
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        {MENU_DATA.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!isDesktopCollapsed && <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-5">{group.groupTitle}</h2>}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isExpanded = expandedMenus.includes(item.id);
                const hasActiveChild = isMenuHasActiveChild(item.children);
                const isDirectlyActive = activePage === item.id;
                const isActive = isDirectlyActive || hasActiveChild;

                return (
                  <li key={item.id} className="relative">
                    <button 
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-xl transition-all duration-200 active:scale-95 group ${isActive && !isExpanded ? 'bg-primary-50 dark:bg-primary-900/20 text-primary font-bold' : isDirectlyActive ? 'bg-primary text-white font-bold shadow-md shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={`${isDirectlyActive ? 'text-white' : isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} transition-colors`} strokeWidth={isActive ? 2.5 : 2} />
                        {!isDesktopCollapsed && <span className="text-[13px]">{item.name}</span>}
                      </div>

                      {!isDesktopCollapsed && item.children && (
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                      )}

                      {/* Tooltip khi collapsed */}
                      {isDesktopCollapsed && (
                        <div className="absolute left-14 top-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-xs font-medium px-2 py-1.5 rounded-md whitespace-nowrap z-50 shadow-xl border border-slate-700">
                          {item.name}
                        </div>
                      )}
                    </button>

                    {/* Sub-menu (Accordion) */}
                    {!isDesktopCollapsed && item.children && isExpanded && (
                      <ul className="mt-1 mb-2 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700 animate-in slide-in-from-top-2 duration-200">
                        {item.children.map(child => (
                          <li key={child.id} className="relative">
                            {/* Connector line */}
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-3 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <button
                              onClick={() => setActivePage(child.id)}
                              className={`w-full text-left pl-10 pr-3 py-2 rounded-xl text-[13px] transition-colors ${activePage === child.id ? 'text-primary font-bold bg-primary-50/50 dark:bg-primary-900/10' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
                            >
                              {child.name}
                            </button>
                          </li>
                        ))}
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
