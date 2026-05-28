package models

import "time"

type User struct {
	ID                 string    `json:"id"` // UUID từ Supabase Auth
	Email              *string   `json:"email,omitempty"`
	FullName           *string   `json:"full_name,omitempty"`
	AvatarURL          *string   `json:"avatar_url,omitempty"`
	EmployeeCode       *string   `json:"employee_code,omitempty"`
	Position           *string   `json:"position,omitempty"`
	Status             string    `json:"status"` // Default: pending_approval
	Phone              *string   `json:"phone,omitempty"`
	WorkState          *string   `json:"work_state,omitempty"`
	RoleID             *string   `json:"role_id,omitempty"`
	CompanyID          *string   `json:"company_id,omitempty"`
	WarehouseID        *int64    `json:"warehouse_id,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`

	// Relational data for responses
	RoleName      *string `json:"role_name,omitempty"`
	CompanyName   *string `json:"company_name,omitempty"`
	WarehouseName *string `json:"warehouse_name,omitempty"`
}
