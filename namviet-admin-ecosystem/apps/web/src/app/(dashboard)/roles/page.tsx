'use client';

import { useState, useEffect } from 'react';
import { roleService, Role } from '@/services/api/role.service';
import { Shield, Plus, Search } from 'lucide-react';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getAll();
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Quản lý Vai trò & Phân quyền
          </h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các nhóm quyền hạn truy cập hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4" />
          Thêm Vai trò
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm vai trò..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Tên Vai trò</th>
                <th scope="col" className="px-6 py-4 font-semibold">Mô tả</th>
                <th scope="col" className="px-6 py-4 font-semibold">Ngày tạo</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Chưa có vai trò nào.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
                    <td className="px-6 py-4">{role.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {role.created_at ? new Date(role.created_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Chỉnh sửa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
