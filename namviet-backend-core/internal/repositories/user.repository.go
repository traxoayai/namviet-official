package repositories

import (
	"database/sql"

	"github.com/namviet/backend-core/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetAll() ([]models.User, error) {
	query := `
		SELECT 
			u.id, u.email, u.full_name, u.avatar_url, u.employee_code, u.position, 
			u.status, u.phone, u.work_state, u.role_id, u.company_id, u.warehouse_id, 
			u.created_at, u.updated_at,
			r.name as role_name,
			c.name as company_name,
			w.name as warehouse_name
		FROM users u
		LEFT JOIN roles r ON u.role_id = r.id
		LEFT JOIN companies c ON u.company_id = c.id
		LEFT JOIN warehouses w ON u.warehouse_id = w.id
		ORDER BY u.created_at DESC
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(
			&u.ID, &u.Email, &u.FullName, &u.AvatarURL, &u.EmployeeCode, &u.Position,
			&u.Status, &u.Phone, &u.WorkState, &u.RoleID, &u.CompanyID, &u.WarehouseID,
			&u.CreatedAt, &u.UpdatedAt,
			&u.RoleName, &u.CompanyName, &u.WarehouseName,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func (r *UserRepository) CreateProfile(user *models.User) error {
	query := `
		INSERT INTO users (id, email, full_name, phone, role_id, company_id, warehouse_id, status) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	_, err := r.db.Exec(query, user.ID, user.Email, user.FullName, user.Phone, user.RoleID, user.CompanyID, user.WarehouseID, user.Status)
	return err
}
