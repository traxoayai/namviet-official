'use client';

import { useState, useEffect } from 'react';
import { userService, User } from '@/services/api/user.service';
import { Users, Plus, Search, MapPin, Briefcase } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Quản lý Nhân sự
          </h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và phân công công việc nhân viên</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4" />
          Thêm Nhân sự
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân sự..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Nhân viên</th>
                <th scope="col" className="px-6 py-4 font-semibold">Vai trò</th>
                <th scope="col" className="px-6 py-4 font-semibold">Công tác</th>
                <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Chưa có nhân sự nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.full_name || 'Chưa cập nhật'}</div>
                          <div className="text-xs text-gray-500">{user.email} • {user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {user.role_name || 'Chưa phân quyền'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Briefcase className="w-3.5 h-3.5" />
                          {user.company_name || '---'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          {user.warehouse_name || '---'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' || user.status === 'working' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status === 'active' || user.status === 'working' ? 'Đang làm việc' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Chi tiết</button>
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
