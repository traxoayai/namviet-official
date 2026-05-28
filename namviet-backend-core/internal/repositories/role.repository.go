package repositories

import (
	"database/sql"
	"fmt"

	"github.com/namviet/backend-core/internal/models"
)

type RoleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

func (r *RoleRepository) GetAll() ([]models.Role, error) {
	query := `SELECT id, name, description, created_at FROM roles ORDER BY created_at ASC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []models.Role
	for rows.Next() {
		var role models.Role
		var desc sql.NullString
		if err := rows.Scan(&role.ID, &role.Name, &desc, &role.CreatedAt); err != nil {
			return nil, err
		}
		if desc.Valid {
			role.Description = desc.String
		}
		roles = append(roles, role)
	}
	return roles, nil
}

func (r *RoleRepository) GetPermissionsByRoleID(roleID string) ([]string, error) {
	query := `SELECT permission_key FROM role_permissions WHERE role_id = $1`
	rows, err := r.db.Query(query, roleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []string
	for rows.Next() {
		var p string
		if err := rows.Scan(&p); err != nil {
			return nil, err
		}
		permissions = append(permissions, p)
	}
	return permissions, nil
}

func (r *RoleRepository) Create(role *models.Role, permissions []string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id, created_at`
	err = tx.QueryRow(query, role.Name, role.Description).Scan(&role.ID, &role.CreatedAt)
	if err != nil {
		return err
	}

	if len(permissions) > 0 {
		stmt, err := tx.Prepare(`INSERT INTO role_permissions (role_id, permission_key) VALUES ($1, $2)`)
		if err != nil {
			return err
		}
		defer stmt.Close()
		for _, p := range permissions {
			if _, err := stmt.Exec(role.ID, p); err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}

func (r *RoleRepository) Delete(id string) error {
	query := `DELETE FROM roles WHERE id = $1`
	res, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	rows, _ := res.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("role not found")
	}
	return nil
}
