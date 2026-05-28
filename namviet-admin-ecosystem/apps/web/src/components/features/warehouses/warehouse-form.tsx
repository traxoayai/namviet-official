import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WarehouseFormData,
  warehouseSchema,
  Warehouse,
} from "@namviet/shared-types/src/warehouse.types";
import { ChevronLeft, Save, Building, MapPin, Phone, Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { toast } from "sonner";
import { useCompanies } from "@/hooks/queries/use-companies";

interface WarehouseFormProps {
  initialData?: Warehouse;
  onSubmit: (data: WarehouseFormData) => void;
  isLoading: boolean;
}

export function WarehouseForm({
  initialData,
  onSubmit,
  isLoading,
}: WarehouseFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { data: companies = [] } = useCompanies();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema) as any,
    defaultValues: {
      company_id: "",
      key: "",
      code: "",
      name: "",
      type: "retail",
      address: "",
      manager: "",
      phone: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        company_id: initialData.company_id || "",
        key: initialData.key,
        code: initialData.code || "",
        name: initialData.name,
        type: initialData.type,
        address: initialData.address || "",
        manager: initialData.manager || "",
        phone: initialData.phone || "",
        latitude: initialData.latitude || undefined,
        longitude: initialData.longitude || undefined,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt không hỗ trợ lấy vị trí');
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude, { shouldValidate: true });
        setValue('longitude', position.coords.longitude, { shouldValidate: true });
        setIsGettingLocation(false);
        toast.success('Lấy vị trí thành công!');
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error('Không thể lấy vị trí. Hãy kiểm tra quyền truy cập.');
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Sticky Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-10 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/warehouses")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Building className="text-primary" size={24} />
              {isEditing ? "Cập nhật Chi nhánh" : "Thêm mới Chi nhánh"}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Điền đầy đủ thông tin để {isEditing ? "cập nhật" : "tạo"} kho/cửa
              hàng
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit((data) => {
            const formattedData = {
              ...data,
              company_id:
                data.company_id?.trim() === "" ? null : data.company_id,
            };
            onSubmit(formattedData);
          })}
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Save size={18} />
          )}
          Lưu thông tin
        </button>
      </div>

      <form className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Thông tin Cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Mã định danh (Key) *
              </label>
              <input
                {...register("key")}
                className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-primary ${errors.key ? "border-red-500" : "border-slate-200"}`}
                placeholder="VD: CN_HCM_01"
              />
              {errors.key && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.key.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Tên Chi nhánh *
              </label>
              <input
                {...register("name")}
                className={`w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-primary ${errors.name ? "border-red-500" : "border-slate-200"}`}
                placeholder="VD: Cửa hàng Quận 1"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Mã nội bộ (Code)
              </label>
              <input
                {...register("code")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                placeholder="VD: WH-001"
              />
            </div>

            <div className="z-20">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Loại hình
              </label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: 'retail', label: 'Cửa hàng Bán lẻ' },
                      { value: 'b2b', label: 'Kho Sỉ (B2B)' },
                      { value: 'warehouse', label: 'Tổng Kho' },
                    ]}
                  />
                )}
              />
            </div>

            <div className="z-20">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Công ty trực thuộc (ID)
              </label>
              <Controller
                control={control}
                name="company_id"
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Không thuộc công ty nào"
                    options={[
                      { value: '', label: 'Không thuộc công ty nào' },
                      ...companies.map(c => ({ value: c.id, label: c.name }))
                    ]}
                  />
                )}
              />
            </div>

            <div className="z-10">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Trạng thái
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: 'active', label: 'Đang hoạt động' },
                      { value: 'inactive', label: 'Tạm ngưng' },
                    ]}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Thông tin Liên hệ & Vị trí
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Địa chỉ
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  {...register("address")}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                  placeholder="Nhập địa chỉ đầy đủ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Vĩ độ (Latitude)
              </label>
              <input
                type="number"
                step="any"
                {...register("latitude")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                placeholder="VD: 10.762622"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Kinh độ (Longitude)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  {...register("longitude")}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                  placeholder="VD: 106.660172"
                />
                <button 
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="shrink-0 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 rounded-xl font-bold transition-colors disabled:opacity-50"
                  title="Lấy vị trí hiện tại"
                >
                  {isGettingLocation ? <span className="animate-spin">⏳</span> : <Map size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Quản lý / Người đại diện
              </label>
              <input
                {...register("manager")}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                placeholder="Tên quản lý..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  {...register("phone")}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
                  placeholder="0909..."
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
