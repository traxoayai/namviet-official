package models

import "time"

type Role struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

type RolePermission struct {
	RoleID        string `json:"role_id"`
	PermissionKey string `json:"permission_key"`
}
