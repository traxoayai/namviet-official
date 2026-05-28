-- Bảng Thông tin Công ty (Dùng để định danh pháp nhân cốt lõi hoặc các chi nhánh)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    business_license_url TEXT[], -- Mảng link ảnh lưu ảnh ĐKKD, giấy GDP,...của công ty
    mission TEXT, -- Sứ mệnh
    vision TEXT, -- Tầm nhìn
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
