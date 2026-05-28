import { 
  Store, Activity, PackageSearch, Boxes, Receipt, Headphones,
  Users, Megaphone, BarChart3, Settings
} from 'lucide-react';

export const MENU_DATA = [
  {
    groupTitle: 'TRẠM LÀM VIỆC',
    items: [
      {
        id: 'retail', // Dùng làm key cho accordion nếu có children
        name: 'Cửa hàng (Bán lẻ)',
        icon: Store,
        children: [
          { href: '/retail/create', name: 'Tạo đơn mới' },
          { href: '/retail/list', name: 'Danh sách Đơn hàng' },
          { href: '/retail/cskh', name: 'Chăm sóc khách hàng' },
        ]
      },
      {
        id: 'medical',
        name: 'Y Tế',
        icon: Activity,
        children: [
          { href: '/medical/reception', name: 'Lễ Tân' },
          { href: '/medical/clinic', name: 'Phòng Khám' },
          { href: '/medical/nursing', name: 'Điều Dưỡng và Thủ Thuật' },
          { href: '/medical/testing', name: 'CĐHA và Xét nghiệm' },
        ]
      },
      {
        id: 'b2b',
        name: 'Bán Sỉ (B2B)',
        icon: PackageSearch,
        children: [
          { href: '/b2b/create', name: 'Tạo đơn mới' },
          { href: '/b2b/list', name: 'Danh sách Đơn hàng' },
          { href: '/b2b/cskh', name: 'Chăm sóc khách hàng (B2B)' },
        ]
      },
      {
        id: 'inventory',
        name: 'Vận hành Kho',
        icon: Boxes,
        children: [
          { href: '/inventory/import', name: 'Nhập hàng' },
          { href: '/inventory/export', name: 'Xuất hàng' },
          { href: '/inventory/transfer', name: 'Chuyển hàng (Kho)' },
          { href: '/inventory/check', name: 'Kiểm kê' },
          { href: '/inventory/gifts', name: 'Quản lý Quà tặng' },
          { href: '/inventory/assets', name: 'Quản lý Vật tư (Tài sản)' },
          { href: '/inventory/shipping', name: 'Giao vận (Theo dõi)' },
        ]
      },
      {
        id: 'accounting',
        name: 'Kế toán',
        icon: Receipt,
        children: [
          { href: '/accounting/receipt', name: 'Phiếu Thu / Chi' },
          { href: '/accounting/vat', name: 'Hóa đơn VAT' },
          { href: '/accounting/report', name: 'Báo cáo tài chính nhanh' },
        ]
      },
      {
        id: 'support',
        name: 'Hỗ trợ & Tương tác',
        icon: Headphones,
        children: [
          { href: '/support/bot', name: 'Tiếp nhận Chatbot' },
          { href: '/support/fb', name: 'Kênh Facebook' },
          { href: '/support/zalo', name: 'Kênh Zalo' },
          { href: '/support/tiktok', name: 'Kênh TMĐT & TikTok' },
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
          { href: '/hr/profile', name: 'Hồ sơ Nhân sự' },
          { href: '/hr/contract', name: 'Hợp đồng & Bảo hiểm' },
          { href: '/hr/training', name: 'Khóa học & Bài thi' },
          { href: '/hr/kpi', name: 'Giao việc & KPI' },
        ]
      },
      {
        id: 'marketing',
        name: 'Marketing & PTKH',
        icon: Megaphone,
        children: [
          { href: '/marketing/segment', name: 'Nhóm khách hàng' },
          { href: '/marketing/voucher', name: 'Voucher & CTKM' },
          { href: '/marketing/sms', name: 'Tin nhắn hàng loạt' },
        ]
      },
      {
        id: 'reports',
        name: 'Báo cáo tổng hợp',
        icon: BarChart3,
        children: [
          { href: '/reports/business', name: 'Báo cáo Kinh doanh' },
          { href: '/reports/finance', name: 'Báo cáo Tài chính' },
          { href: '/reports/inventory', name: 'Báo cáo Kho' },
          { href: '/reports/marketing', name: 'Báo cáo Marketing' },
        ]
      },
      {
        id: 'master_data',
        name: 'Cấu hình Hệ thống',
        icon: Settings,
        children: [
          { href: '/warehouses', name: 'Quản lý Chi nhánh' },
          { href: '/roles', name: 'Quản lý Phân quyền' },
          { href: '/users', name: 'Quản lý Nhân sự' },
        ]
      }
    ]
  }
];

export const getPageTitleByHref = (currentHref: string) => {
  if (currentHref === '/' || currentHref === '/dashboard') return 'Dashboard';
  
  for (const group of MENU_DATA) {
    for (const item of group.items) {
      if ('href' in item && item.href === currentHref) return item.name;
      if (item.children) {
        const child = item.children.find(c => currentHref.startsWith(c.href));
        if (child) return child.name;
      }
    }
  }
  return 'Trang tính năng';
};
