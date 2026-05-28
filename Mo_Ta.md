-- 1. Bảng Thông tin Công ty (Dùng để định danh pháp nhân cốt lõi)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    logo_url TEXT, -- Lưu đường dẫn Cloudinary, KHÔNG lưu file vật lý
    representative_name VARCHAR(100), -- Tên người đại diện pháp luật
    business_image_license_url jsonb, -- Mảng Link ảnh chụp ĐKKD + Căn cước công dân .. của cty
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Bảng Danh sách Chi nhánh / Cửa hàng
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    code VARCHAR(50) NOT NULL UNIQUE, -- Mã chi nhánh (VD: CN_HCM_01)
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    manager_id UUID, -- Sẽ liên kết FK với bảng users/employees sau
    latitude NUMERIC(10, 7), -- Tọa độ GPS phục vụ tính toán khoảng cách giao hàng
    longitude NUMERIC(10, 7),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Tạo Index để tối ưu truy vấn tìm kiếm chi nhánh theo công ty hoặc trạng thái
CREATE INDEX idx_branches_company_id ON branches(company_id);
CREATE INDEX idx_branches_status ON branches(status) WHERE deleted_at IS NULL;

-- 3. Bảng Đối tác vận chuyển (GHTK, GHN, AhaMove, Nội bộ...)
CREATE TABLE shipping_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE, -- VD: GHTK, VNPOST, INTERNAL
    name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(50) NOT NULL, -- Dựa trên file database.types.ts ('app', 'coach', 'internal')
    api_config JSONB, -- Lưu trữ Access Token, Webhook Secret, Endpoint linh hoạt cho từng đối tác
    tracking_url_template TEXT, -- Mẫu URL để check mã vận đơn (VD: https://ghtk.vn/tracking?id={tracking_code})
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

Thêm nữa, hãy sử dụng 